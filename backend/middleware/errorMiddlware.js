const errorHandler = (err, req, res, next) => {
  // If status code alrdy set, do nothing.
  const status_code = res.statusCode ? res.statusCode : 500;

  res.status(status_code);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  })
  
}

module.exports = {
  errorHandler,
}