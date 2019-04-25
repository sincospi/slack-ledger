const Big = require('big.js');

const { 
  toCurrencyStr,
  formatAsBold,
  formatAsItalic,
  formatAsCode,
  blockSection,
  blockContext,
  dateStr,
  ephemeralResponse,
} = require('./slackFormaters');



module.exports = function listFormatter(otherUser, transactions, balance) {
  const blocks = [];
  let text;

  if (!transactions.length) {
    text = formatAsBold(`You have no transactions with ${otherUser.encodedName}`);
    blocks.push(blockSection(text));
    return ephemeralResponse(blocks);
  }

  text = formatAsBold(`Your balance with ${otherUser.encodedName} is ${formatAsCode(toCurrencyStr(balance))}`);
  if (balance.gt(0)) {
    text += ' (they owe you)';
  } else if (balance.lt(0)) {
    text += ' (you owe them)';
  }
  blocks.push(blockSection(text));

  text = `Here is a list of your transactions with ${otherUser.encodedName}:`;
  blocks.push(blockContext(text));

  let runningBalance = Big(0);

  const transactionsInfo = transactions
    .map((t, i) => {
      let signedAmount;
      if (t.isCreditForUser(otherUser)) {
        signedAmount = Big(t.amount).times(-1);
      } else {
        signedAmount = t.amount;
      }
      
      text = formatAsCode(toCurrencyStr(signedAmount));
      text += '\t';
      text += `for ${formatAsBold(t.description)}`;
      text += '\t';

      if (t.creator && t.creator.slackId === otherUser.slackId) {
        text += formatAsItalic(`${otherUser.encodedName} on ${dateStr(t.createdAt)}`);
      } else if (t.creator) {
        text += formatAsItalic(`you on ${dateStr(t.createdAt)}`);
      } else {
        text += formatAsItalic(`on ${dateStr(t.createdAt)}`);
      }

      runningBalance = runningBalance.plus(signedAmount);
      text += '\t';
      text += formatAsItalic(`(new bal.: ${toCurrencyStr(runningBalance)})`);

      return text;
    }).join('\n');
  
  blocks.push(blockSection(transactionsInfo));

  return ephemeralResponse(blocks);
};
