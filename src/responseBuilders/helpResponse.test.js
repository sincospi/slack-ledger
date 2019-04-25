const helpText = require('../services/help');
const helpResponse = require('./helpResponse');

describe('helpResponse', () => {
  it('should render the help text', () => {
    const responseObj = helpResponse(helpText);
    console.log(JSON.stringify(responseObj));
  });
});
