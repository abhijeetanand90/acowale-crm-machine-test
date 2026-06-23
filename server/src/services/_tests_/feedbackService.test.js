import { beforeEach, expect, test, vi } from "vitest";

vi.mock("../../models/feedbackModel.js", function () {
  const Feedback = {
    create: vi.fn(),
    findAndCountAll: vi.fn(),
    count: vi.fn(),
    findAll: vi.fn(),
  };

  return {
    default: Feedback,

    FeedbackCategory: {
      Product: "product",
      FeatureRequest: "feature_request",
      UIUX: "ui_ux",
      Support: "support",
      Billing: "billing",
      Other: "other",
    },

    FeedbackStatus: {
      Open: "open",
      Reviewed: "reviewed",
      Resolved: "resolved",
    },
  };
});

const { default: Feedback } = await import("../../models/feedbackModel.js");

const {
  createFeedback,
  getFeedbackList,
  getFeedbackSummary,
} = await import("../feedbackService.js");

beforeEach(function () {
  vi.clearAllMocks();
});

test("creates feedback", async function () {
  const payload = {
    category: "product",
    comment: "Dashboard is useful",
    email: "test@example.com",
  };

  const createdFeedback = {
    id: "feedback-1",
    category: "product",
    comment: "Dashboard is useful",
    email: "test@example.com",
    status: "open",
  };

  Feedback.create.mockResolvedValue(createdFeedback);

  const result = await createFeedback(payload);

  expect(Feedback.create).toHaveBeenCalledWith({
    category: "product",
    comment: "Dashboard is useful",
    email: "test@example.com",
  });

  expect(result).toEqual(createdFeedback);
});

test("returns paginated feedback list", async function () {
  Feedback.findAndCountAll.mockResolvedValue({
    rows: [
      {
        id: "feedback-1",
        category: "product",
        comment: "Dashboard is useful",
        email: "test@example.com",
        status: "open",
      },
    ],
    count: 1,
  });

  const result = await getFeedbackList({
    search: "",
    category: "product",
    status: "open",
    page: 1,
    limit: 10,
  });

  expect(Feedback.findAndCountAll).toHaveBeenCalledWith(
    expect.objectContaining({
      limit: 10,
      offset: 0,
      order: [["createdAt", "DESC"]],
    })
  );

  expect(result.pagination).toEqual({
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  expect(result.feedbacks.length).toBe(1);
});

test("returns feedback summary with zero-filled counts", async function () {
  Feedback.count.mockResolvedValue(2);

  Feedback.findAll
    .mockResolvedValueOnce([
      {
        status: "open",
        count: "2",
      },
    ])
    .mockResolvedValueOnce([
      {
        category: "product",
        count: "2",
      },
    ])
    .mockResolvedValueOnce([
      {
        id: "feedback-1",
        category: "product",
        comment: "Dashboard is useful",
        email: "test@example.com",
        status: "open",
        createdAt: "2026-06-23T02:26:22.835Z",
      },
    ]);

  const result = await getFeedbackSummary();

  expect(result.total).toBe(2);

  expect(result.statusCounts).toEqual({
    open: 2,
    reviewed: 0,
    resolved: 0,
  });

  expect(result.categoryCounts).toEqual([
    {
      category: "product",
      count: 2,
    },
    {
      category: "feature_request",
      count: 0,
    },
    {
      category: "ui_ux",
      count: 0,
    },
    {
      category: "support",
      count: 0,
    },
    {
      category: "billing",
      count: 0,
    },
    {
      category: "other",
      count: 0,
    },
  ]);

  expect(result.recent.length).toBe(1);
});