const expect = require('expect.js');

const Transaction = require('./transaction.model');
const User = require('./user.model');

const x = {};
x.domain = 'test';

describe('Transaction model', () => {
  it('should save to the database', async () => {
    const user1 = new User({ encodedName: 'u1', slackId: '1' });
    const user2 = new User({ encodedName: 'u2', slackId: '2' });
    const t = new Transaction({
      domain: x.domain,
      creator: user1,
      debtor: user1,
      creditor: user2,
      amount: 1,
      description: 'test',
    });
    await t.save();
    const t1 = await Transaction.findOne({ debtor: user1._id }); // eslint-disable-line no-underscore-dangle
    expect(t1.description).to.be.eql(t.description);
  });
});
