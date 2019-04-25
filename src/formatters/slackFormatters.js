const Big = require('big.js');

function toCurrencyStr(number) {
  return `${Big(number).toFixed(2)} €`;
}

function dateStr(date) {
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(date - timezoneOffset)
    .toISOString()
    .split('T')
    .shift();
}

function formatAsCode(text) {
  return `\`${text}\``;
}

function formatAsItalic(text) {
  return `_${text}_`;
}

function formatAsBold(text) {
  return `*${text}*`;
}

function blockSection(text) {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text,
    },
  };
}

function blockContext(text) {
  return {
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text,
      },
    ],
  };
}

const blockDivider = {
  type: 'divider',
};

module.exports = {
  toCurrencyStr,
  dateStr,
  formatAsCode,
  formatAsItalic,
  formatAsBold,
  blockSection,
  blockContext,
  blockDivider,
};
