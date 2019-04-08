module.exports = function logRequest(req, res, next) {
  const msg = [
    new Date(),
    req.domain ? req.domain : 'Undefined-domain',
    req.user ? req.user.encodedName : 'Anonymous',
    JSON.stringify(req.textParams),
  ];
  console.log(msg.join(' '));
  next();
};
