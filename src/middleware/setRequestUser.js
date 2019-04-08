const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  const { body } = req;
  const { user_id, user_name } = body;
  if (user_id && user_name) {
    const encodedName = `<@${user_id}|${user_name}>`;
    req.user = await User.findUpsert(req.domain, encodedName);
    return next();
  }
  return next(new Error('No request user!'));
};
