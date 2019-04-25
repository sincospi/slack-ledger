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

Transaction.prototype.signedAmountForUser = function signedAmountForUser(user) {
  if (this.isDebtForUser(user)) {
    return Big(this.amount).times(-1);
  }
  if (this.isCreditForUser(user)) {
    return Big(this.amount);
  }
  // If transaction does not mention user
  return Big(0);
};

Transaction.prototype.effectedUser = function effectedUser() {
  if (!this.creator) {
    return null;
  }
  if (this.creator.id === this.debtor.id) {
    return this.creditor;
  }
  return this.debtor;
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
    // if user Not mentioned in transaction, skip it...
    return sum;
    // throw new Error(
    //   'All transactions provided to balanceForUser should include user as creditor or debtor!',
    // );
  }, Big(0));
};

module.exports = Transaction;
