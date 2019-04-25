const Transaction = require('../models/transaction.model');

module.exports = async function createTransactions(
  domain,
  reqUser,
  userAmountPairs,
  description,
) {
  if (!description) {
    throw new Error('Missing `description`');
  }

  const allTransactions = userAmountPairs.map(t => {
    const { user, amount } = t;
    if (user.slackId === reqUser.slackId) {
      return null; // null transaction if other user is also self
    }
    const creator = reqUser;
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
      creator,
      debtor,
      creditor,
      amount: Math.abs(amount),
      description,
    });
  }).filter(Boolean); // Discards any null transaction

  await Promise.all(allTransactions.map(t => t.save()));

  return allTransactions;
};
