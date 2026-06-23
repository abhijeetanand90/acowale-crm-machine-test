import express from "express";

import { createFeedbackController,getFeedbackListController,getFeedbackSummaryController } from "../controllers/feedbackController.js";
import { validateBody,validateQuery } from "../middlewares/validation.js";
import { feedbackRateLimiter } from "../middlewares/rateLimiter.js";
import { createFeedbackSchema,getFeedbackQuerySchema } from "./schema.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/",
  feedbackRateLimiter,
  validateBody(createFeedbackSchema),
  asyncHandler(createFeedbackController)
);

router.get("/", validateQuery(getFeedbackQuerySchema), asyncHandler(getFeedbackListController));
router.get("/summary", asyncHandler(getFeedbackSummaryController));


export default router;