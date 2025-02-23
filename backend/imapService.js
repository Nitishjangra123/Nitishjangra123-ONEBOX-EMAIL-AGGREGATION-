const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const elasticService = require('./elasticService');
const emailCategorizer = require('./emailCategorizer');
const slackNotifier = require('./slackNotifier');
const webhookNotifier = require('./webhookNotifier');

const accounts = [
  {
    user: 'nitishjangra7056@gmail.com',
    password: 'Nitish7056@',
    host: 'imap.gmail.com',
    port: 993,
    tls: true
  },
  {
    user: 'Nitishjangra70567@gmail.com',
    password: 'Nitishjangra70567@',
    host: 'imap.gmail.com',
    port: 993,
    tls: true
  }
];

function setupImapConnection(account) {
  const imap = new Imap(account);

  imap.once('ready', function () {
    imap.openBox('INBOX', false, function (err, box) {
      if (err) throw err;
      console.log(`Connected to ${account.user} INBOX`);

      // Fetch emails from the last 30 days
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - 30);
      imap.search([ 'ALL', ['SINCE', sinceDate.toISOString()] ], function (err, results) {
        if (err) throw err;
        if (results.length > 0) {
          const fetch = imap.fetch(results, { bodies: '' });
          fetch.on('message', function (msg) {
            msg.on('body', function (stream) {
              simpleParser(stream, async (err, parsed) => {
                if (err) {
                  console.error('Parse error:', err);
                  return;
                }
                processEmail(account.user, 'INBOX', parsed);
              });
            });
          });
        }
      });

      // Listen for new messages using IMAP IDLE (no cron jobs)
      imap.on('mail', function (numNewMsgs) {
        console.log(`New mail on ${account.user}: ${numNewMsgs} new messages`);
        imap.search([ 'UNSEEN' ], function (err, results) {
          if (err) throw err;
          if (results.length > 0) {
            const fetch = imap.fetch(results, { bodies: '' });
            fetch.on('message', function (msg) {
              msg.on('body', function (stream) {
                simpleParser(stream, async (err, parsed) => {
                  if (err) {
                    console.error('Parse error:', err);
                    return;
                  }
                  processEmail(account.user, 'INBOX', parsed);
                });
              });
            });
          }
        });
      });
    });
  });

  imap.once('error', function (err) {
    console.error(`IMAP error for ${account.user}:`, err);
  });

  imap.once('end', function () {
    console.log(`IMAP connection ended for ${account.user}`);
  });

  imap.connect();
}

async function processEmail(account, folder, emailData) {
  // Categorize the email using a dummy AI function
  const category = await emailCategorizer.categorize(emailData);
  emailData.category = category;
  emailData.account = account;
  emailData.folder = folder;

  // Index the email in Elasticsearch
  await elasticService.indexEmail(emailData);

  // Trigger notifications for emails marked as "Interested"
  if (category === 'Interested') {
    await slackNotifier.sendNotification(emailData);
    await webhookNotifier.trigger(emailData);
  }
}

module.exports = {
  start: function () {
    accounts.forEach(account => {
      setupImapConnection(account);
    });
  }
};
