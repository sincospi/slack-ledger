# Ledger Slack App

An app to keep track of unresolved financial transactions between workspace users on slack.

Initialize: `npm install`


# Development

`npm run serve`


# Testing

`npm run test`


# Deployment

For production, environment variables are set in `env.yaml` (Duplicate `env.sample.yaml` into `env.yaml`).

`sls deploy`
`sls logs -f app -t`
