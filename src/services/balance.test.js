const expect = require('expect.js');

const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const balance = require('./balance');

const x = {}; // fixtures object
x.domain = 'test';

describe('balance Service', () => {
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
      { domain, creator: u1, debtor: u1, creditor: u2, amount: 3, description: 'test' },
      { domain, creator: u2, debtor: u2, creditor: u1, amount: 5, description: 'test' },
      { domain, creator: u1, debtor: u1, creditor: u2, amount: 7, description: 'test' },
      { domain, creator: u1, debtor: u1, creditor: u3, amount: 1, description: 'test' },
      { domain, creator: u1, debtor: u1, creditor: u3, amount: 1, description: 'test' },
      { domain, creator: u1, debtor: u1, creditor: u3, amount: 1, description: 'test' },
      { domain, creator: u4, debtor: u4, creditor: u1, amount: 11, description: 'test' },
    ];
    await Promise.all(transactions.map(async t => new Transaction(t).save()));
  });

  it('should compute correct balance', async () => {
    const summary = await balance(x.domain, x.u1);

    const u2Balance = summary.find(b => b.user.id === x.u2.id).amount;
    expect(u2Balance.toFixed(2)).to.be('-5.00');

    const u3Balance = summary.find(b => b.user.id === x.u3.id).amount;
    expect(u3Balance.toFixed(2)).to.be('-3.00');

    const u4Balance = summary.find(b => b.user.id === x.u4.id).amount;
    expect(u4Balance.toFixed(2)).to.be('11.00');
  });
});
