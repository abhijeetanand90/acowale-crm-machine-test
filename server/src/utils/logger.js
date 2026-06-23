import fs from "fs";
import path from "path";
import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const logDirectory = path.join(process.cwd(), "logs");

if (!isProduction && !fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const transports = [new winston.transports.Console()];

if (!isProduction) {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    })
  );
}

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
});

export default logger;