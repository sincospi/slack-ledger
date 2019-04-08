const Transaction = require('../models/transaction.model');

module.exports = async function createTransactions(
  domain,
  reqUser,
  perUserAmount,
  description,
) {
  if (!description) {
    throw new Error('Missing `description`');
  }

  const allTransactions = perUserAmount.map(t => {
    const { user, amount } = t;
    let debtor;
    let creditor;
    if (amount > 0) {
      debtor = user;
      creditor = reqUser;
    } else {
      debtor = reqUser;
      creditor = user;
    }
    return new Transaction({
      domain,
      debtor,
      creditor,
      amount: Math.abs(amount),
      description,
    });
  });

  await Promise.all(allTransactions.map(t => t.save()));

  return allTransactions;
};
