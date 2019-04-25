const expect = require('expect.js');

const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const lastTransactions = require('./lastTransactions');

const x = {}; // fixtures object
x.domain = 'test';

describe('lastTransactions Service', () => {
  beforeEach(async () => {
    const { domain } = x;
    const users = ['<@11|u1>', '<@22|u2>', '<@33|u3>', '<@44|u4>'];
    const [u1, u2, u3, u4] = await Promise.all(
      users.map(async encName =>
        new User(User.fromEncodedName(x.domain, encName)).save(),
      ),
    );
    Object.assign(x, { u1, u2, u3, u4 });
    const transactions = [
      { domain, creator: u1, debtor: u1, creditor: u2, amount: 3, description: 'test 1' },
      { domain, creator: u2, debtor: u2, creditor: u1, amount: 5, description: 'test 2' },
      { domain, creator: u1, debtor: u1, creditor: u2, amount: 7, description: 'test 3' },
      { domain, creator: u1, debtor: u1, creditor: u3, amount: 1, description: 'test 4' },
      { domain, creator: u1, debtor: u1, creditor: u3, amount: 1, description: 'test 5' },
      { domain, creator: u1, debtor: u1, creditor: u3, amount: 1, description: 'test 6' },
      { domain, creator: u4, debtor: u4, creditor: u1, amount: 11, description: 'test 7' },
    ];
    await Promise.all(transactions.map(async t => new Transaction(t).save()));
  });

  it('should return transactions only for specified user', async () => {
    const transactions = await lastTransactions(x.domain, x.u2);
    expect(transactions.length).to.eql(3);
  });

  it('should return transactions for all users', async () => {
    const transactions = await lastTransactions(x.domain);
    expect(transactions.length).to.eql(7);
  });
});
