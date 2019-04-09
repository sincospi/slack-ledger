const test = {
  shouldVerifySlackRequest: false,
  dbUri: 'mongodb://localhost/ledger-test',
};

const development = {
  shouldVerifySlackRequest: false,
  dbUri: 'mongodb://localhost/ledger-dev',
};

const production = {
  shouldVerifySlackRequest: true,
  dbUri: '',
};

/**
 * A single server can serve multiple slack workgroups
 * The following dictionary holds Client (signing) secrets per workgroup domain
 * key: workgroup domain name
 * value: slack client signing secret
 */
const slackClientSecret = {
  'workgroup-domain-name': 'slack-client-signing-secret',
};

module.exports = {
  test,
  development,
  production,
  slackClientSecret,
};
