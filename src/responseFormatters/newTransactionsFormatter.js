const toCurrencyStr = require('./currencyFormatter');

module.exports = function newTransactionsFormatter(transactions) {
  const payload = {
    response_type: 'in_channel',
    text: `${transactions.length} records saved`,
  };

  payload.attachments = transactions
    .map(t => {
      const { debtor, creditor, amount } = t;
      return `${debtor.encodedName} owes ${
        creditor.encodedName
      } ${toCurrencyStr(amount)}`;
    })
    .map(text => ({ text }));
  return payload;
};
