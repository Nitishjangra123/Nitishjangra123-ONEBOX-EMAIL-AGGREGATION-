const { Client } = require('elasticsearch');

// Configure the Elasticsearch client with better defaults for Docker
const client = new Client({
  nodes: ['http://localhost:9200'],
  requestTimeout: 30000,
  pingTimeout: 3000,
  maxRetries: 3,
  sniffOnStart: false,
  log: 'error'
});

const INDEX = 'emails';

// Convert promise-based index check to async/await for better error handling
async function initializeIndex() {
  try {
    // First check if we can connect to Elasticsearch
    await client.ping({
      requestTimeout: 3000
    });
    console.log('Connected to Elasticsearch');

    const exists = await client.indices.exists({ index: INDEX });
    if (!exists) {
      await client.indices.create({
        index: INDEX,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0
          },
          mappings: {
            properties: {
              account: { type: 'keyword' },
              folder: { type: 'keyword' },
              subject: { type: 'text' },
              text: { type: 'text' },
              category: { type: 'keyword' },
              date: { type: 'date' }
            }
          }
        }
      });
      console.log('Elasticsearch index created');
    }
  } catch (error) {
    console.error('Elasticsearch initialization error:', error);
    // Don't throw here - let the service start even if ES is temporarily unavailable
  }
}

// Initialize the index
initializeIndex();

module.exports = {
  indexEmail: async function (emailData) {
    if (!emailData) {
      throw new Error('Email data is required');
    }

    try {
      const response = await client.index({
        index: INDEX,
        body: {
          account: emailData.account,
          folder: emailData.folder,
          subject: emailData.subject,
          text: emailData.text,
          category: emailData.category,
          date: emailData.date || new Date(),
          timestamp: new Date() // Add indexing timestamp
        }
      });
      console.log('Email indexed in Elasticsearch:', response);
      return response;
    } catch (error) {
      console.error('Error indexing email:', error);
      throw error; // Propagate error to caller
    }
  },

  searchEmails: async function ({ account, folder, query, from = 0, size = 50 }) {
    const must = [];
    
    if (account) {
      must.push({ match: { account } });
    }
    if (folder) {
      must.push({ match: { folder } });
    }
    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['subject^2', 'text'], // Give subject higher weight
          fuzziness: 'AUTO' // Enable fuzzy matching
        }
      });
    }

    try {
      const result = await client.search({
        index: INDEX,
        body: {
          from, // Support pagination
          size,
          query: {
            bool: { must }
          },
          sort: [
            { date: { order: 'desc' }}, // Sort by date descending
            '_score' // Then by relevance
          ]
        }
      });

      return {
        total: result.hits.total.value,
        emails: result.hits.hits.map(hit => ({
          ...hit._source,
          score: hit._score
        }))
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Add a health check method
  checkHealth: async function() {
    try {
      const health = await client.cluster.health();
      return health.status;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};