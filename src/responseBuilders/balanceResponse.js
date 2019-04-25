const {
  toCurrencyStr,
  formatAsCode,
  formatAsBold,
  blockSection,
  blockContext,
} = require('../formatters/slackFormatters');
const { ephemeralResponse } = require('./slackResponses');

module.exports = function balanceResponse(balanceWithUsers) {
  let blocks = [];
  let text;

  if (!balanceWithUsers.length) {
    text = formatAsBold(
      'Your balance with all users is zero. Go make some transactions :)',
    );
    blocks.push(blockSection(text));
    return ephemeralResponse(blocks);
  }

  text = 'Your balance with respect to every other user:';
  blocks.push(blockContext(text));

  const perUserBalanceBlocks = balanceWithUsers
    .filter(bal => !bal.amount.eq(0))
    .map(bal => {
      text = `Your balance with ${bal.user.encodedName} is ${formatAsCode(
        toCurrencyStr(bal.amount),
      )}`;
      if (bal.amount.gt(0)) {
        text += ' (they owe you)';
      } else {
        text += ' (you owe them)';
      }
      text = formatAsBold(text);
      return blockSection(text);
    });

  blocks = blocks.concat(perUserBalanceBlocks);

  text = `Use ${formatAsCode(
    '/ledger @user',
  )} to see all transactions with that user`;
  if (balanceWithUsers.length) {
    blocks.push(blockContext(text));
  }

  text = `Use ${formatAsCode('/ledger help')} to see all available commands`;
  blocks.push(blockContext(text));

  return ephemeralResponse(blocks);
};
