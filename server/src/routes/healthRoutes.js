import express from "express";
import { healthCheck } from "../controllers/healthController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/_health", asyncHandler(healthCheck));

export default router;