const toCurrencyStr = require('./currencyFormatter');

function timestampStr(date) {
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(date - timezoneOffset)
    .toISOString()
    .split('.')
    .shift()
    .replace('T', ' ');
}

module.exports = function listFormatter(otherUser, transactions, balance) {
  const payload = {
    response_type: 'ephemeral',
  };

  if (!transactions.length) {
    payload.text = `You have no transactions with ${otherUser.encodedName}`;
    return payload;
  }

  if (balance.gt(0)) {
    payload.text = `*${otherUser.encodedName} owes you ${toCurrencyStr(
      balance,
    )}*:`;
  } else if (balance.lt(0)) {
    payload.text = `*You owe* ${otherUser.encodedName} *${toCurrencyStr(
      Math.abs(balance),
    )}*:`;
  } else {
    payload.text = `Your balance with ${otherUser.encodedName} is zero:`;
  }

  payload.attachments = transactions
    .map(t => {
      let sign = '+';
      if (t.isCreditForUser(otherUser)) {
        sign = '-';
      }
      return `\`${timestampStr(t.createdAt)}\` ${sign}${toCurrencyStr(
        t.amount,
      )} for _"${t.description}"_`;
    })
    .map(text => ({ text }));
  return payload;
};
