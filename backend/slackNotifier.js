const axios = require('axios');

// Replace with your actual Slack webhook URL
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK';

module.exports = {
  sendNotification: async function (emailData) {
    try {
      await axios.post(SLACK_WEBHOOK_URL, {
        text: `New Interested Email for ${emailData.account}:\nSubject: ${emailData.subject}`
      });
      console.log('Slack notification sent');
    } catch (error) {
      console.error('Error sending Slack notification:', error);
    }
  }
};
