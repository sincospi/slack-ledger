const {
  // toCurrencyStr,
  // formatAsBold,
  // formatAsCode,
  blockSection,
} = require('../formatters/slackFormatters');
const transactionsFormatter = require('../formatters/transactionsFormatter');
const { inChannelResponse } = require('./slackResponses');

module.exports = function newTransactionsFormatter(transactions) {
  const blocks = [];

  blocks.push(blockSection(`${transactions.length} records saved`));

  if (transactions.length) {
    blocks.push(transactionsFormatter(transactions));
  }

  return inChannelResponse(blocks);
};
