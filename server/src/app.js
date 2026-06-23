
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/healthRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import { requestLogger } from "./middlewares/requestLogger.js";



const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(requestLogger);
app.use("/", healthRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use(errorHandler);

export default app;