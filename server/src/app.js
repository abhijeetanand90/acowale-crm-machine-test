
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/healthRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";



const app = express();

app.use(cors());
app.use(express.json());
app.use("/", healthRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use(errorHandler);

export default app;