import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;


async function master() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    app.listen(PORT, function () {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect database:", error);
    process.exit(1);
  }
}

master();