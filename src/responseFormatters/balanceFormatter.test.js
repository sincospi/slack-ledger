// const expect = require('expect.js');
const Big = require('big.js');

const User = require('../models/user.model');

const balanceFormatter = require('./balanceFormatter');

const x = {}; // fixtures object
x.domain = 'test';

describe('balanceFormatter', () => {
  beforeEach(async () => {
    [x.u1, x.u2, x.u3] = ['<@1|u1>', '<@2|u2>', '<@3|u3>'].map(
      u => new User(User.fromEncodedName(x.domain, u)),
    );
    x.perUserBalance = [
      { user: x.u1, amount: Big(1) },
      { user: x.u2, amount: Big(-3) },
      { user: x.u3, amount: Big(0) },
    ];
  });

  it('should format per user balance', () => {
    const responseObj = balanceFormatter(x.perUserBalance);
    console.log(responseObj);
    // const { attachments } = responseObj;
    // expect(attachments.length).to.be(2);
    // expect(attachments[0].text).to.be('<@1|u1> owes you 1.00 €');
    // expect(attachments[1].text).to.be('You owe <@2|u2> 3.00 €');
  });
});
