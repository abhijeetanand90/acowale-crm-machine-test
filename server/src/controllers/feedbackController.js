import { createFeedback,getFeedbackList } from "../services/feedbackService.js";

export async function createFeedbackController(req, res, next) {
  try {
    const { category, comment, email } = req.validated.body;

    const feedback = await createFeedback({
      category,
      comment,
      email,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your feedback has been recorded.",
      data: {
        id: feedback.id,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getFeedbackListController(req, res, next) {
  try {
    const { search, category, status, page, limit } = req.validated.query;

    const result = await getFeedbackList({
      search,
      category,
      status,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result.feedbacks,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}
