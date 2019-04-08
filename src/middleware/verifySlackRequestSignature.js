const crypto = require('crypto');
const timingSafeCompare = require('tsscmp');

module.exports = function verifySlackRequestSignature(req, res, next) {
  const { headers, rawBody } = req;
  const timestamp = headers['x-slack-request-timestamp'];
  const slackSignature = headers['x-slack-signature'];
  let version;
  if (slackSignature) {
    version = slackSignature.split('=').shift();
  }

  const sigBaseString = [version, timestamp, rawBody].join(':');
  const hmac = crypto.createHmac(
    'sha256',
    process.env.SLACK_OAUTH_ACCESS_TOKEN,
  );
  hmac.update(sigBaseString);
  const mySignature = `${version}=${hmac.digest('hex')}`;

  if (timingSafeCompare(mySignature, slackSignature)) {
    next();
  } else {
    console.debug('Access Denied');
    res.sendStatus(401);
  }
};
