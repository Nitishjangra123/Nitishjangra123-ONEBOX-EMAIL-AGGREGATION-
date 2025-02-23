const axios = require('axios');

const WEBHOOK_URL = 'https://webhook.site/YOUR_UNIQUE_URL';

module.exports = {
  trigger: async function (emailData) {
    try {
      await axios.post(WEBHOOK_URL, {
        email: emailData
      });
      console.log('Webhook triggered');
    } catch (error) {
      console.error('Error triggering webhook:', error);
    }
  }
};
