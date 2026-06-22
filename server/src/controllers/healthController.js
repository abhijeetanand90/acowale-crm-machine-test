import { sequelize } from "../config/database.js";

export async function healthCheck(req, res) {
  try {
    await sequelize.query("SELECT 1");

    res.status(200).json({
      success: true,
      status: "ok",
      message: "Server and database are healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(503).json({
      success: false,
      status: "degraded",
      message: "Database connection failed",
      timestamp: new Date().toISOString(),
    });
  }
}