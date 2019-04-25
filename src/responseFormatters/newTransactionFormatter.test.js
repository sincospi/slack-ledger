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
      description: 'ordering food',
    });
    x.t2 = new Transaction({
      domain,
      creator: x.u1,
      debtor: x.u3,
      creditor: x.u1,
      amount: 3,
      description: 'ordering food',
    });
  });

  it('should render number of records saved and include these records', () => {
    const transactions = [x.t1, x.t2];
    const responseObj = newTransactionsFormatter(transactions);
    console.log('responseObj', JSON.stringify(responseObj));
    expect(responseObj.blocks.length).to.eql(3);
    expect(responseObj.blocks[0].text.text).to.be('2 records saved');
  });

  it('should not render attachments if transactions arr is empty', () => {
    const transactions = [];
    const responseObj = newTransactionsFormatter(transactions);
    console.log('responseObj', JSON.stringify(responseObj));
    expect(responseObj.blocks.length).to.eql(1);
    expect(responseObj.blocks[0].text.text).to.be('0 records saved');
  });
});
