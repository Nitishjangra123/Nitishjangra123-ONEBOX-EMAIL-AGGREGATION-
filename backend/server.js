const express = require('express');
const bodyParser = require('body-parser');
const imapservice = require('./imapservice');
const elasticService = require('./elasticService');
const vectorDBService = require('./vectorDbService');

const app = express();
app.use(bodyParser.json());

// Endpoint to search for emails (filter by account, folder, and search query)
app.get('/emails', async (req, res) => {
  const { account, folder, query } = req.query;
  try {
    const results = await elasticService.searchEmails({ account, folder, query });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to get AI-suggested replies based on the email content
app.post('/suggest-reply', async (req, res) => {
  const { emailContent } = req.body;
  try {
    const suggestion = await vectorDBService.getSuggestedReply(emailContent);
    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server and then initialize the IMAP connections
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  imapservice.start();
});
