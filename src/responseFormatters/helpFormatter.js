const {
  blockSection,
  ephemeralResponse,
} = require('./slackFormaters');

module.exports = function helpFormater(text) {
  const blocks = [];
  blocks.push(blockSection(text));
  return ephemeralResponse(blocks);
};
