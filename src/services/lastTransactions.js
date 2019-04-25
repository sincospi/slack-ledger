const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

module.exports = async function lastTransactions(domain, reqUser, limit = 15) {
  const q = {
    domain,
  };
  if (reqUser) {
    q.$or = [{ creditor: reqUser.id }, { debtor: reqUser.id }];
  }
  const transactions = await Transaction.find(q)
    .sort({ _id: -1 })
    .populate({ path: 'creator', model: User })
    .populate({ path: 'debtor', model: User })
    .populate({ path: 'creditor', model: User })
    .limit(limit);

  return transactions.reverse();
};
