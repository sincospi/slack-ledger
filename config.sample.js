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
 * The following dictionary holds access tokens per workgroup domain
 */
const slackWorkgroupAccessToken = {
  'workgroup-domain-name': 'slack-oauth-access-token',
};

module.exports = {
  test,
  development,
  production,
  slackWorkgroupAccessToken,
};
