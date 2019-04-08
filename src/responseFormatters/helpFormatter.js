module.exports = function helpFormater(text) {
  return {
    response_type: 'ephemeral',
    text: '`/ledger` usage instructions',
    attachments: [
      {
        text,
      },
    ],
  };
};
