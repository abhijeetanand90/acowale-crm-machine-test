import { z } from "zod";
import { FeedbackCategory, FeedbackStatus } from "../models/feedbackModel.js";

const validCategories = Object.values(FeedbackCategory);
const validStatuses = Object.values(FeedbackStatus);

export const createFeedbackSchema = z.object({
  category: z
    .string()
    .trim()
    .min(1, "category is required")
    .refine(function (value) {
      return validCategories.includes(value);
    }, `category must be one of: ${validCategories.join(", ")}`),

  comment: z
    .string()
    .trim()
    .min(1, "comment is required")
    .max(1000, "comment must not exceed 1000 characters"),

  email: z.preprocess(
    function (value) {
      if (typeof value !== "string") return value;

      const trimmedValue = value.trim();
      return trimmedValue === "" ? null : trimmedValue;
    },
    z.string().email("email must be valid").nullable().optional()
  ),
});

export const updateFeedbackStatusSchema = z.object({
  status: z
    .string()
    .trim()
    .refine(function (value) {
      return validStatuses.includes(value);
    }, `status must be one of: ${validStatuses.join(", ")}`),
});

export const getFeedbackQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .optional()
    .transform(function (value) {
      return value || undefined;
    }),

  category: z
    .string()
    .optional()
    .refine(
      function (value) {
        return !value || validCategories.includes(value);
      },
      {
        message: `category must be one of: ${validCategories.join(", ")}`,
      }
    ),

  status: z
    .string()
    .optional()
    .refine(
      function (value) {
        return !value || validStatuses.includes(value);
      },
      {
        message: `status must be one of: ${validStatuses.join(", ")}`,
      }
    ),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(10),
});