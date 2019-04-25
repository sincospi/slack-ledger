const expect = require('expect.js');

const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const newTransactionsFormatter = require('./newTransactionsFormatter');

const x = {}; // fixtures object
x.domain = 'test';

describe('newTransactionsFormatter', () => {
  beforeEach(async () => {
    const { domain } = x;
    [x.u1, x.u2, x.u3] = ['<@1|u1>', '<@2|u2>', '<@3|u3>'].map(
      u => new User(User.fromEncodedName(x.domain, u)),
    );
    x.t1 = new Transaction({
      domain,
      creator: x.u1,
      debtor: x.u1,
      creditor: x.u2,
      amount: 2,
      description: 'transaction 1',
    });
    x.t2 = new Transaction({
      domain,
      creator: x.u1,
      debtor: x.u3,
      creditor: x.u1,
      amount: 3,
      description: 'transaction 2',
    });
  });

  it('should render number of records saved and include these records', () => {
    const transactions = [x.t1, x.t2];
    const responseObj = newTransactionsFormatter(transactions);
    console.log('responseObj', responseObj);
    expect(responseObj.text).to.be('2 records saved');
    expect(responseObj.attachments.length).to.eql(2);
  });

  it('should not render attachments if transactions arr is empty', () => {
    const transactions = [];
    const responseObj = newTransactionsFormatter(transactions);
    expect(responseObj.text).to.be('0 records saved');
    expect(responseObj.attachments).to.be(undefined);
  });
});
