const bodyParser = require('body-parser');

module.exports = bodyParser.urlencoded({
  extended: true,
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
});
