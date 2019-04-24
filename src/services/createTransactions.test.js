const expect = require('expect.js');

const User = require('../models/user.model');

const createTransactions = require('./createTransactions');

const x = {}; // fixtures object
x.domain = 'test';

describe('createTransactions Service', () => {
  beforeEach(async () => {
    [x.u1, x.u2, x.u3, x.u4] = await Promise.all(
      ['<@1|u1>', '<@2|u2>', '<@3|u3>', '<@4|u4>'].map(async u =>
        new User(User.fromEncodedName(x.domain, u)).save(),
      ),
    );
  });

  it('should create single transaction', async () => {
    const userAmount = {
      user: x.u2,
      amount: 2,
    };
    const transactions = await createTransactions(
      x.domain,
      x.u1,
      [userAmount],
      'test single transaction',
    );
    expect(transactions[0].creditor.slackId).to.be('1');
    expect(transactions[0].debtor.slackId).to.be('2');
    expect(transactions[0].amount).to.be(2);
  });

  it('should reverse creditor/debtor for negative amounts', async () => {
    const userAmount = {
      user: x.u2,
      amount: -2,
    };
    const transactions = await createTransactions(
      x.domain,
      x.u1,
      [userAmount],
      'test single transaction',
    );
    expect(transactions[0].creditor.slackId).to.be('2');
    expect(transactions[0].debtor.slackId).to.be('1');
    expect(transactions[0].amount).to.be(2);
  });

  it('should create multiple transactions', async () => {
    const userAmount1 = {
      user: x.u2,
      amount: 2,
    };
    const userAmount2 = {
      user: x.u3,
      amount: 3,
    };
    const transactions = await createTransactions(
      x.domain,
      x.u1,
      [userAmount1, userAmount2],
      'test multiple transactions',
    );
    expect(transactions.length).to.be(2);
    expect(transactions[1].creditor.slackId).to.be('1');
    expect(transactions[1].debtor.slackId).to.be('3');
    expect(transactions[1].amount).to.be(3);
  });

  it('should ignore transaction with self', async () => {
    const userAmount1 = {
      user: x.u2,
      amount: 2,
    };
    const userAmountSelf = {
      user: x.u1,
      amount: 1,
    };
    const transactions = await createTransactions(
      x.domain,
      x.u1,
      [userAmount1, userAmountSelf],
      'test transactions invlolving self',
    );
    expect(transactions.length).to.be(1);
  });
});
