import http from "http";
import logger from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  if (
    typeof status !== "number" ||
    !http.STATUS_CODES[status] ||
    status >= 500
  ) {
    logger.error("request_error", {
      message: err.message,
      stack: err.stack,
      method: req.method,
      path: req.originalUrl,
      status,
    });
  }

  return res.status(status).json({
    success: false,
    error: err.id || "internal_error",
    status,
    message: err.message || "Internal server error",
  });
}