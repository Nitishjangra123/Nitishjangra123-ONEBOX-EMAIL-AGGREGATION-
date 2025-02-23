# OneBox Email Aggregator



A full-stack project that aggregates multiple IMAP email accounts into a single interface, provides real-time updates, powerful search (via Elasticsearch), and AI-based email categorization. Optional features include Slack notifications, webhook triggers, and AI-suggested replies


## Features

1)Real-Time IMAP Sync: Connects to multiple email accounts using persistent connections.

2)Elasticsearch Search: Indexes emails for fast full-text search.

3)AI Categorization: Labels emails (Interested, Spam, etc.) using a basic AI function.

4)Notifications: Sends Slack and webhook alerts for specific email categories.


## installation

Clone the Repository:


## Deployment

To deploy this project run

```bash
git clone https://github.com/Nitishjangra123/onebox-email-aggregator git
cd onebox-email-aggregator
```

install Dependencies:
```bash
cd backend
npm install
```




## configuration

IMAP Credentials: Update ``` backend/imapService.js ```with your IMAP account details.

Elasticsearch: Ensure Elasticsearch is running (e.g., via Docker or local install) at the configured URL in ```backend/elasticService.js```.

Slack/Webhook: Update the webhook URLs in ```backend/slackNotifier.js``` and ```backend/webhookNotifier.js ```.

## Running the Project

Start Elasticsearch:
(Using Docker)

```bash
 docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:8.10.0

```

Start the Backend:

```bash
cd backend
npm start
```

Start the Frontend:

```bash
cd ../frontend
npm start
```
