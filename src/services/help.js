const helpText = [
  '*Usage instructions:*',
  'Use `/ledger` to see your debt/credit with respect to all other users.',
  'Use `/ledger @user` to see latest transactions with particular @user.',
  'Use `/ledger @user amount description` to create a new record indicating debt/credit between yourself and another @user.',
  '• _+ve amounts indicate you are in credit, @user in debt._',
  '• _-ve amounts indicate you are in debt, @user in credit._',
  '• _You can provide multiple `@user amount` pairs in the same command to generate multiple transactions sharing the same description._',
].join('\n');

module.exports = helpText;
