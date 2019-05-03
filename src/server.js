const express = require('express');
const serverless = require('serverless-http');

if (process.env.NODE_ENV) {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
} else {
  throw new Error('process.env.NODE_ENV is not defined!');
}

const config = require('../config');
require('./mongooseConnect');

// Middleware
const customisedBodyParser = require('./middleware/bodyParser');
const logRawRequestBody = require('./middleware/logRawRequestBody');
const verifySlackRequest = require('./middleware/verifySlackRequest');
const setRequestDomain = require('./middleware/setRequestDomain');
const setRequestUser = require('./middleware/setRequestUser');
const setRequestTextParams = require('./middleware/setRequestTextParams');
const errorHandler = require('./middleware/errorHandler');
const logRequest = require('./middleware/logRequest');

// Controllers
const handleSlackRequest = require('./handleSlackRequest');

const app = express();
app.use(customisedBodyParser);
app.use(logRawRequestBody);
app.use(setRequestDomain);
if (config[process.env.NODE_ENV].shouldVerifySlackRequest) {
  console.log('Slack request verification is ENABLED');
  app.use(verifySlackRequest);
} else {
  console.log('Slack request verification is DISABLED');
}
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
