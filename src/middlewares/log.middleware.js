import Logger from './utils/logger.js';

const loggerMiddleware = (req, res, next) => {
  const { method, url } = req;
  const logMessage = `[${method}] ${url}`;

  Logger.log(logMessage);

  next();
};

export default loggerMiddleware;
