const Big = require('big.js');

const {
  toCurrencyStr,
  // formatAsBold,
  formatAsItalic,
  formatAsCode,
  blockSection,
  blockContext,
  dateStr,
} = require('./slackFormatters');

module.exports = function transactionsFormatter(
  transactions,
  userForRunningBalance,
) {
  let text;

  if (!transactions.length) {
    return blockContext('There are no transactions to list');
  }

  let runningBalance = Big(0);

  const transactionsList = transactions
    .map(t => {
      // 2019-04-08 @creator owes/charged/credited @otherUser 3.00 E for bla bla bla (new bal.: -3:00)
      text = formatAsItalic(dateStr(t.createdAt));

      if (t.creator) {
        if (t.isCreditForUser(t.creator)) {
          text += ` ${t.creator.encodedName} charged ${t.debtor.encodedName}`;
        } else {
          text += ` ${t.creator.encodedName} credited ${
            t.creditor.encodedName
          }`;
        }
      } else {
        text += ` ${t.debtor.encodedName} owes ${t.creditor.encodedName}`;
      }

      text += ` ${formatAsCode(toCurrencyStr(t.amount))}`;
      text += ` for ${t.description}`;

      if (userForRunningBalance) {
        const signedAmount = t.signedAmountForUser(userForRunningBalance);
        runningBalance = runningBalance.plus(signedAmount);
        text += ` (new bal.: ${toCurrencyStr(runningBalance)})`;
      }

      return text;
    })
    .join('\n');

  return blockSection(transactionsList);
};
