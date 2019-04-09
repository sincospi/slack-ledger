# Ledger Slack App

An app to keep track of unresolved financial transactions between workspace users on slack.

Initialize: `npm install`


# Env Variables and Config

The top level env variable is NODE_ENV. It is set inline for test and development scripts (see package.json)
and inside serverless.yaml for production.

All remaining configuration is obtained from `config.js` (see `config.sample.js` template).

Request from slack need to be verified using a 'slack client signing secret'.
You will need to include this inside `config.js`.
Because a single server can serve multiple slack workgroups, you specify it as `workspace` - `secret` pairs.



# Development

`npm run start`


# Testing

`npm run test`


# AWS Lambda (via serverless framework)

Deployment:
```
sls deploy --stage production --region eu-central-1
```


Get service information, e.g. get endpoint url
```
sls info --stage production --region eu-central-1
```

Tails logs:
```
sls logs -f app -t --stage production --region eu-central-1
```

Note: If your shell has multiple aws profiles defined, prepend your commands with `AWS_PROFILE=yourchoosenprofile`
