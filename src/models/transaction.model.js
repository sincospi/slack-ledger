const Mongoose = require('mongoose');
const Big = require('big.js');

const schema = Mongoose.Schema(
  {
    domain: { type: String, required: true, index: true },
    creator: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    debtor: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creditor: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  // --- Options ---
  {
    collection: 'transactions', // sets mongo collection name
  },
);

const Transaction = Mongoose.model('Transaction', schema);

Transaction.prototype.isCreditForUser = function isCreditForUser(user) {
  return this.creditor.id === user.id;
};

Transaction.prototype.isDebtForUser = function isCreditForUser(user) {
  return this.debtor.id === user.id;
};

/**
 * @param user
 * @param transactionList - list of transactions (that include user as debtor or creditor)?
 */
Transaction.balanceForUser = function balanceForUser(user, transactionList) {
  return transactionList.reduce((sum, t) => {
    if (t.isCreditForUser(user)) {
      return sum.plus(t.amount);
    }
    if (t.isDebtForUser(user)) {
      return sum.minus(t.amount);
    }
    // throw new Error(
    //   'All transactions provided to balanceForUser should include user as creditor or debtor!',
    // );
    return sum;
  }, Big(0));
};

module.exports = Transaction;
