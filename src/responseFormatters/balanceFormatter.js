const toCurrencyStr = require('./currencyFormatter');

module.exports = function balanceFormatter(perUserBalance) {
  const payload = {
    response_type: 'ephemeral',
  };

  if (!perUserBalance.length) {
    payload.text =
      'Your balance with all users is zero. Go make some transactions :)';
    return payload;
  }

  payload.text = `Your balance with respect to every other user:`;
  payload.attachments = perUserBalance
    .filter(bal => !bal.amount.eq(0))
    .map(bal => {
      if (bal.amount.gt(0)) {
        return `${bal.user.encodedName} *owes you* ${toCurrencyStr(
          bal.amount,
        )}`;
      }
      return `*You owe* ${bal.user.encodedName} ${toCurrencyStr(
        Math.abs(bal.amount),
      )}`;
    })
    .map(text => ({ text }));
  return payload;
};
