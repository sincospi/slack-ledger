const User = require('./models/user.model');

const helpText = require('./services/help');
const balance = require('./services/balance.js');
const createTransactions = require('./services/createTransactions.js');
const list = require('./services/list.js');

const helpFormatter = require('./responseFormatters/helpFormatter');
const balanceFormatter = require('./responseFormatters/balanceFormatter');
const newTransactionFormatter = require('./responseFormatters/newTransactionsFormatter');
const listFormatter = require('./responseFormatters/listFormatter');

module.exports = async function handleSlackRequest(req, res, next) {
  const params = { ...req.textParams, reqUser: req.user, domain: req.domain };

  if (params.service === 'BALANCE') {
    let data;
    try {
      const { domain, reqUser } = params;
      data = await balance(domain, reqUser);
      data = balanceFormatter(data);
    } catch (error) {
      return next(error);
    }
    return res.send(data);
  }

  if (params.service === 'HELP') {
    return res.send(helpFormatter(helpText));
  }

  if (params.service === 'CREATE_TRANSACTIONS') {
    const { domain, reqUser, userAmounts, description } = params;
    // Populate userAmounts users...
    const userAmountPairs = await Promise.all(
      userAmounts.map(async ua => ({
        user: await User.findUpsert(domain, ua.user),
        amount: ua.amount,
      })),
    );

    let data;
    try {
      data = await createTransactions(
        domain,
        reqUser,
        userAmountPairs,
        description,
      );
      data = newTransactionFormatter(data);
    } catch (error) {
      return next(error);
    }
    return res.send(data);
  }

  if (params.service === 'LIST_TRANSACTIONS') {
    let data;
    try {
      const { domain, reqUser, user } = params;
      const otherUser = await User.findUpsert(domain, user);
      data = await list(domain, reqUser, otherUser);
      data = listFormatter(otherUser, data.transactions, data.balance);
    } catch (error) {
      return next(error);
    }
    return res.send(data);
  }

  const usageHelp = 'Use `/ledger help` for usage instructions.';
  return next(new Error(`Invalid command. ${usageHelp}`));
};
