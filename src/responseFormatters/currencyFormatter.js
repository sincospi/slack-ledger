const Big = require('big.js');

module.exports = function toCurrencyStr(number) {
  return `${Big(number).toFixed(2)} €`;
};
