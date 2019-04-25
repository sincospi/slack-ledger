const helpText = require('../services/help');
const helpFormatter = require('./helpFormatter');

describe('helpFormatter', () => {
  it('should render the help text', () => {
    const responseObj = helpFormatter(helpText);
    console.log(JSON.stringify(responseObj));
  });
});