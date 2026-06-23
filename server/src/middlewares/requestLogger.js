import logger from "../utils/logger.js";

export function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on("finish", function () {
    const duration = Date.now() - startTime;

    logger.info("http_request", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
    });
  });

  next();
}