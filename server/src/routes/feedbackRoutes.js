import express from "express";

import { createFeedbackController,getFeedbackListController,getFeedbackSummaryController } from "../controllers/feedbackController.js";
import { validateBody,validateQuery } from "../middlewares/validation.js";
import { feedbackRateLimiter } from "../middlewares/rateLimiter.js";
import { createFeedbackSchema,getFeedbackQuerySchema } from "./schema.js";

const router = express.Router();

router.post(
  "/",
  feedbackRateLimiter,
  validateBody(createFeedbackSchema),
  createFeedbackController
);

router.get("/", validateQuery(getFeedbackQuerySchema), getFeedbackListController);
router.get("/summary", getFeedbackSummaryController);

export default router;