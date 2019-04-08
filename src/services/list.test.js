const expect = require('expect.js');

const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const list = require('./list');

const x = {}; // fixtures object
x.domain = 'test';

describe('list Service', () => {
  beforeEach(async () => {
    const { domain } = x;
    const users = ['<@11|u1>', '<@22|u2>'];
    const [u1, u2] = await Promise.all(
      users.map(async encName =>
        new User(User.fromEncodedName(x.domain, encName)).save(),
      ),
    );
    Object.assign(x, { u1, u2 });
    const transactions = [
      { domain, debtor: u1, creditor: u2, amount: 3, description: 'test-1' },
      { domain, debtor: u2, creditor: u1, amount: 5, description: 'test-2' },
      { domain, debtor: u1, creditor: u2, amount: 7, description: 'test-3' },
      { domain, debtor: u2, creditor: u1, amount: 1, description: 'test-4' },
      { domain, debtor: u1, creditor: u2, amount: 11, description: 'test-5' },
    ];
    await Promise.all(transactions.map(async t => new Transaction(t).save()));
  });

  it('should list all transactions and compute correct balance', async () => {
    const listObj = await list(x.domain, x.u1, x.u2);
    expect(listObj.transactions.length).to.be(5);
    expect(listObj.balance.toFixed(2)).to.be('-15.00');
  });
});
