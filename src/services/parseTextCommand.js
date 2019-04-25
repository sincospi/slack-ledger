const userRegex = /<@[^>]+>/;
const userAmountPairRegex = /(<@[^>]+>)\s+(-?\d+[.,\d]*)/;

function parseTextCommand(textCommand) {
  const params = {};

  const text = textCommand && textCommand.trim();
  params.text = text;

  if (!text) {
    params.service = 'BALANCE';
    return params;
  }

  let m = text.match(/help/i);
  if (m) {
    params.service = 'HELP';
    return params;
  }

  m = text.match(/tail/i);
  if (m) {
    params.service = 'TAIL';
    return params;
  }

  m = text.match(userAmountPairRegex);
  if (m) {
    params.service = 'CREATE_TRANSACTIONS';
    params.userAmounts = [];
    let remainingText = text;
    while (m) {
      const user = m[1];
      const amount = parseFloat(m[2].replace(/,/g, '.'));
      params.userAmounts.push({ user, amount });
      remainingText = remainingText.slice(m.index + m[0].length);
      m = remainingText.match(userAmountPairRegex);
    }
    const description = remainingText.trim();
    params.description = description;
    return params;
  }

  m = text.match(userRegex);
  if (m) {
    params.service = 'LIST_TRANSACTIONS';
    params.user = m.shift();
    return params;
  }

  return params;
}

module.exports = parseTextCommand;
