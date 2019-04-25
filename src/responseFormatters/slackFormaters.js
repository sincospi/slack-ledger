const Big = require('big.js');

function toCurrencyStr(number) {
  return `${Big(number).toFixed(2)} €`;
}

function blockSection(text) {
  return {
		type: 'section',
		text: {
			type: 'mrkdwn',
      text
    },
  };
}

function blockContext(text) {
  return {
		type: 'context',
		elements: [{
			type: 'mrkdwn',
      text
    }],
  };
}

const blockDivider = {
  type: 'divider',
};

function formatAsCode(text) {
  return `\`${text}\``;
}

function formatAsItalic(text) {
  return `_${text}_`;
}

function formatAsBold(text) {
  return `*${text}*`;
}

function dateStr(date) {
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(date - timezoneOffset)
    .toISOString()
    .split('T')
    .shift();
}

function ephemeralResponse(blocks) {
  return {
    response_type: 'ephemeral',
    blocks,
  };
}

function inChannelResponse(blocks) {
  return {
    response_type: 'in_channel',
    blocks,
  };
}

module.exports = {
  dateStr,
  toCurrencyStr,
  blockSection,
  blockContext,
  blockDivider,
  formatAsCode,
  formatAsItalic,
  formatAsBold,
  ephemeralResponse,
  inChannelResponse,
};
