const { 
  toCurrencyStr,
  formatAsBold,
  formatAsCode,
  blockSection, 
  inChannelResponse, 
} = require('./slackFormaters');

module.exports = function newTransactionsFormatter(transactions) {
  let blocks = [];
  let text;

  text = `${transactions.length} records saved`;
  blocks.push(blockSection(text));

  if (transactions.length) {
    const transactionBlocks = transactions
    .map(t => {
      const { debtor, creditor, amount, description } = t;
      text = `${debtor.encodedName} owes `;
      text += formatAsCode(toCurrencyStr(amount));
      text += ` to ${creditor.encodedName}`;
      text = formatAsBold(text);
      text += `, for ${description}`;
      return blockSection(text);
    });

    blocks = blocks.concat(transactionBlocks);
  }

  return inChannelResponse(blocks);
};
