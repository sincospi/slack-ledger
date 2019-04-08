module.exports = async (req, res, next) => {
  const { body } = req;
  const { team_domain } = body;
  if (team_domain) {
    req.domain = team_domain;
    return next();
  }
  return next(new Error('No team_domain!'));
};
