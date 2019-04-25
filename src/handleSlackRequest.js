const User = require('./models/user.model');

const helpText = require('./services/help');
const balance = require('./services/balance.js');
const lastTransactions = require('./services/lastTransactions');
const createTransactions = require('./services/createTransactions.js');
const transactionsWithUser = require('./services/transactionsWithUser');

const helpResponse = require('./responseBuilders/helpResponse');
const balanceResponse = require('./responseBuilders/balanceResponse');
const addTransactionsResponse = require('./responseBuilders/addTransactionsResponse');
const transactionsWithUserResponse = require('./responseBuilders/transactionsWithUserResponse');

module.exports = async function handleSlackRequest(req, res, next) {
  const params = { ...req.textParams, reqUser: req.user, domain: req.domain };

  if (params.service === 'BALANCE') {
    let responseData;
    try {
      const { domain, reqUser } = params;
      const balanceWithUsers = await balance(domain, reqUser);
      responseData = balanceResponse(balanceWithUsers);
    } catch (error) {
      return next(error);
    }
    return res.send(responseData);
  }

  if (params.service === 'HELP') {
    return res.send(helpResponse(helpText));
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

    let responseData;
    try {
      const data = await createTransactions(
        domain,
        reqUser,
        userAmountPairs,
        description,
      );
      responseData = addTransactionsResponse(data);
    } catch (error) {
      return next(error);
    }
    return res.send(responseData);
  }

  if (params.service === 'LIST_TRANSACTIONS') {
    let responseData;
    try {
      const { domain, reqUser, user } = params;
      const otherUser = await User.findUpsert(domain, user);
      const data = await transactionsWithUser(domain, reqUser, otherUser);
      responseData = transactionsWithUserResponse(
        reqUser,
        otherUser,
        data.transactions,
        data.balance,
      );
    } catch (error) {
      return next(error);
    }
    return res.send(responseData);
  }

  const usageHelp = 'Use `/ledger help` for usage instructions.';
  return next(new Error(`Invalid command. ${usageHelp}`));
};
