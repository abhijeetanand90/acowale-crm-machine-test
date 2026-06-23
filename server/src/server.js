import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./config/database.js";
import "./models/feedbackModel.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function master() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");

    app.listen(PORT, function () {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

master();