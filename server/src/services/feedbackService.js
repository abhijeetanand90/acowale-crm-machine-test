import Feedback from "../models/feedbackModel.js";
import { Op } from "sequelize";
import { buildFeedbackFilter } from "../utils/buildFeedbackFilter.js";
import {
  getPagination,
  buildPaginationMeta,
} from "../utils/pagination.js";




const FEEDBACK_LIST_ATTRIBUTES = [
  "id",
  "category",
  "comment",
  "email",
  "status",
  "createdAt",
  "updatedAt",
];

export async function createFeedback(data) {
  const { category, comment, email } = data;

  const feedback = await Feedback.create({
    category,
    comment: comment.trim(),
    email: email && email.trim() ? email.trim().toLowerCase() : null,
  });

  return feedback;
}


export async function getFeedbackList({ search, category, status, page, limit }) {
  const where = buildFeedbackFilter({
    search,
    category,
    status,
  });

  const { limit: queryLimit, offset } = getPagination({
    page,
    limit,
  });

  const { rows, count } = await Feedback.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: queryLimit,
    offset,
    attributes: FEEDBACK_LIST_ATTRIBUTES,
  });

  return {
    feedbacks: rows,
    pagination: buildPaginationMeta({
      count,
      page,
      limit,
    }),
  };
}