const expect = require('expect.js');

const User = require('./user.model');

const x = {};
x.domain = 'test';

describe('User model', () => {
  it('should parse user id correctly from encodedName', () => {
    const id = 'U12313';
    const encodedName = `<@${id}|sincospi_u2>`;
    const user = User.fromEncodedName(x.domain, encodedName);
    expect(user.encodedName).to.be(encodedName);
    expect(user.slackId).to.be(id);
  });

  it('should save to the database', async () => {
    const user = await User.findUpsert('test', '<@U12313|sincospi_u2>');
    expect(user.slackId).to.be.eql('U12313');
    expect(user.domain).to.be.eql('test');
  });
});
