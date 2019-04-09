# Ledger Slack App

An app to keep track of unresolved financial transactions between workspace users on slack.

Initialize: `npm install`


# Env Variables and Config

The top level env variable is NODE_ENV. It is set inline for test and development scripts (see package.json) and inside serverless.yaml for production.

All remaining configuration is obtained from `config.js` (see `config.sample.js` template).


# Development

`npm run start`


# Testing

`npm run test`


# Deployment: AWS Lambda (via serverless framework)

```
serverless deploy --stage production --region eu-central-1
```

```
sls logs -f app -t --stage production --region eu-central-1
```

Note: If your shell has multiple aws profiles defined, prepend your commands with `AWS_PROFILE=yourchoosenprofile`
