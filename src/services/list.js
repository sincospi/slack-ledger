const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

module.exports = async function list(domain, reqUser, otherUser) {
  const q = {
    domain,
    $or: [
      { creditor: reqUser.id, debtor: otherUser.id },
      { creditor: otherUser.id, debtor: reqUser.id },
    ],
  };
  const transactions = await Transaction.find(q)
    .sort({ _id: 1 })
    .populate({ path: 'creator', model: User })
    .populate({ path: 'debtor', model: User })
    .populate({ path: 'creditor', model: User });

  const balance = Transaction.balanceForUser(reqUser, transactions);

  return {
    transactions,
    balance,
  };
};
