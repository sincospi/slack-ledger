const { blockSection } = require('../formatters/slackFormatters');
const { ephemeralResponse } = require('./slackResponses');

module.exports = function helpFormater(text) {
  const blocks = [];
  blocks.push(blockSection(text));
  return ephemeralResponse(blocks);
};
