// const Big = require('big.js');

const {
  toCurrencyStr,
  formatAsBold,
  formatAsCode,
  blockSection,
  blockContext,
} = require('../formatters/slackFormatters');
const transactionsFormatter = require('../formatters/transactionsFormatter');
const { ephemeralResponse } = require('./slackResponses');

module.exports = function transactionsWithUser(
  reqUser,
  otherUser,
  transactions,
  balance,
) {
  const blocks = [];
  let text;

  if (!transactions.length) {
    text = formatAsBold(
      `You have no transactions with ${otherUser.encodedName}`,
    );
    blocks.push(blockSection(text));
    return ephemeralResponse(blocks);
  }

  text = formatAsBold(
    `Your balance with ${otherUser.encodedName} is ${formatAsCode(
      toCurrencyStr(balance),
    )}`,
  );
  if (balance.gt(0)) {
    text += ' (they owe you)';
  } else if (balance.lt(0)) {
    text += ' (you owe them)';
  }
  blocks.push(blockSection(text));

  text = `Here is a list of your transactions with ${otherUser.encodedName}:`;
  blocks.push(blockContext(text));

  blocks.push(transactionsFormatter(transactions, reqUser));

  return ephemeralResponse(blocks);
};
