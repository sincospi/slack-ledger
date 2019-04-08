const parseTextCommand = require('../services/parseTextCommand');

module.exports = function setRequestTextParams(req, res, next) {
  const textParams = parseTextCommand(req.body ? req.body.text : '');
  req.textParams = textParams;
  next();
};
