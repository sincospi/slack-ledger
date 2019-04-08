// const expect = require('expect.js');
// const Big = require('big.js');

const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const listFormatter = require('./listFormatter');

const x = {}; // fixtures object
x.domain = 'test';

describe('balanceFormatter', () => {
  beforeEach(() => {
    [x.u1, x.u2] = ['<@1|u1>', '<@2|u2>'].map(
      u => new User(User.fromEncodedName(x.domain, u)),
    );
    x.transactions = [
      { debtor: x.u1, creditor: x.u2, amount: 3, description: 'test-1' },
      { debtor: x.u2, creditor: x.u1, amount: 5, description: 'test-2' },
      { debtor: x.u1, creditor: x.u2, amount: 7, description: 'test-3' },
      { debtor: x.u2, creditor: x.u1, amount: 1, description: 'test-4' },
    ].map(t => new Transaction(t));

    x.balance = Transaction.balanceForUser(x.u1, x.transactions);
  });

  it('should format the transactions list', () => {
    const responseObj = listFormatter(x.u2, x.transactions, x.balance);
    console.log(responseObj);
  });
});
