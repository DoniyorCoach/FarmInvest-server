const logger = require('../logs');

function loggerMiddleware(req, res, next) {
  req.logger = logger;
  next();
}

module.exports = loggerMiddleware;