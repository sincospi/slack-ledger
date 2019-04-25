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
  ephemeralResponse,
  inChannelResponse,
};
