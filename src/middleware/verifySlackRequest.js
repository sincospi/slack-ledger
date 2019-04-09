const crypto = require('crypto');
const timingSafeCompare = require('tsscmp');

const config = require('../../config');

module.exports = function verifySlackRequest(req, res, next) {
  const { headers, rawBody } = req;
  const oauthAccessToken = config.slackClientSecret[req.domain];
  if (!oauthAccessToken) {
    return next(
      new Error(`No slack oauth access token for domain ${req.domain}`),
    );
  }
  const timestamp = headers['x-slack-request-timestamp'];
  const slackSignature = headers['x-slack-signature'];
  let version;
  if (slackSignature) {
    version = slackSignature.split('=').shift();
  }

  const sigBaseString = [version, timestamp, rawBody].join(':');
  const hmac = crypto.createHmac('sha256', oauthAccessToken);
  hmac.update(sigBaseString);
  const mySignature = `${version}=${hmac.digest('hex')}`;

  if (timingSafeCompare(mySignature, slackSignature)) {
    return next();
  }

  console.debug('Access Denied');
  return res.sendStatus(401);
};
