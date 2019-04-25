const { blockSection, blockContext } = require('../formatters/slackFormatters');
const transactionsFormatter = require('../formatters/transactionsFormatter');
const { ephemeralResponse } = require('./slackResponses');

module.exports = function allUserTransactions(transactions) {
  const blocks = [];

  if (!transactions.length) {
    blocks.push(blockSection('This workspace has no transactions yet!'));
    return ephemeralResponse(blocks);
  }

  blocks.push(blockContext('Workspace latest transactions:'));

  blocks.push(transactionsFormatter(transactions));

  return ephemeralResponse(blocks);
};
