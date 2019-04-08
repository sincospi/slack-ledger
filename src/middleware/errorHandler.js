function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err);
  return res.send({
    response_type: 'ephemeral',
    text: err.message,
  });
}

module.exports = errorHandler;
