import http from "http";

export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  if (
    typeof status !== "number" ||
    !http.STATUS_CODES[status] ||
    status >= 500
  ) {
    console.error("Error:", err);
  }

  return res.status(status).json({
    success: false,
    error: err.id || "internal_error",
    status,
    message: err.message || "Internal server error",
  });
}