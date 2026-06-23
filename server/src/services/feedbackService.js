import Feedback,{FeedbackStatus,FeedbackCategory} from "../models/feedbackModel.js";

import { Op,fn,col } from "sequelize";
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

export async function getFeedbackSummary() {
  const total = await Feedback.count();

  const statusRows = await Feedback.findAll({
    attributes: ["status", [fn("COUNT", col("id")), "count"]],
    group: ["status"],
    raw: true,
  });

  const categoryRows = await Feedback.findAll({
    attributes: ["category", [fn("COUNT", col("id")), "count"]],
    group: ["category"],
    raw: true,
  });

  const recent = await Feedback.findAll({
    order: [["createdAt", "DESC"]],
    limit: 5,
    attributes: ["id", "category", "comment", "email", "status", "createdAt"],
  });

  const statusCounts = Object.values(FeedbackStatus).reduce(function (acc, status) {
    acc[status] = 0;
    return acc;
  }, {});

  statusRows.forEach(function (row) {
    statusCounts[row.status] = Number(row.count);
  });

  const categoryCounts = Object.values(FeedbackCategory).map(function (category) {
    const match = categoryRows.find(function (row) {
      return row.category === category;
    });

    return {
      category,
      count: match ? Number(match.count) : 0,
    };
  });

  return {
    total,
    statusCounts,
    categoryCounts,
    recent,
  };
}