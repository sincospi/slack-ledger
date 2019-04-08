const express = require('express');
const serverless = require('serverless-http');

require('./src/setYamlEnvVariables');
require('./src/mongooseConnect');

// Middleware
const customisedBodyParser = require('./src/middleware/bodyParser');
const logRawRequestBody = require('./src/middleware/logRawRequestBody');
const verifySlackRequestSignature = require('./src/middleware/verifySlackRequestSignature');
const setRequestDomain = require('./src/middleware/setRequestDomain');
const setRequestUser = require('./src/middleware/setRequestUser');
const setRequestTextParams = require('./src/middleware/setRequestTextParams');
const errorHandler = require('./src/middleware/errorHandler');
const logRequest = require('./src/middleware/logRequest');

// Controllers
const handleSlackRequest = require('./src/handleSlackRequest');

const app = express();
app.use(customisedBodyParser);
app.use(logRawRequestBody);
if (process.env.SKIP_VERIFY_SLACK_REQUEST === 'true') {
  console.log('Slack request verification is DISABLED');
} else {
  console.log('Slack request verification is ENABLED');
  app.use(verifySlackRequestSignature);
}
app.use(setRequestDomain);
app.use(setRequestUser);
app.use(setRequestTextParams);
app.use(logRequest);

app.get('/', (req, res) => {
  res.send({ status: 'OK' });
});

app.post('/', (req, res, next) => {
  handleSlackRequest(req, res, next);
});

app.use(errorHandler); // must be last middleware

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
module.exports.handler = serverless(app);
