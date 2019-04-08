const Big = require('big.js');

const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

module.exports = async function balance(domain, reqUser) {
  const [creditTransactions, debtTransactions] = await Promise.all([
    Transaction.find({ domain, creditor: reqUser.id })
      .sort({ _id: 1 })
      .populate({ path: 'debtor', model: User }),
    Transaction.find({ domain, debtor: reqUser.id })
      .sort({ _id: 1 })
      .populate({ path: 'creditor', model: User }),
  ]);

  const otherUsers = [];
  creditTransactions.forEach(t => {
    if (!otherUsers.some(u => u.id === t.debtor.id)) otherUsers.push(t.debtor);
  });
  debtTransactions.forEach(t => {
    if (!otherUsers.some(u => u.id === t.creditor.id))
      otherUsers.push(t.creditor);
  });

  const perUserBalance = otherUsers.map(user => {
    const credit = creditTransactions
      .filter(t => t.debtor.id === user.id)
      .reduce((sum, t) => sum.plus(t.amount), Big(0));
    const debt = debtTransactions
      .filter(t => t.creditor.id === user.id)
      .reduce((sum, t) => sum.plus(t.amount), Big(0));
    return {
      user,
      amount: credit.minus(debt),
    };
  });

  return perUserBalance;
};
