import { Op } from "sequelize";

export function buildFeedbackFilter({ search, category, status }) {
  const where = {};

  if (category) {
    where.category = category;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where[Op.or] = [
      {
        comment: {
          [Op.iLike]: `%${search}%`,
        },
      },
      {
        email: {
          [Op.iLike]: `%${search}%`,
        },
      },
    ];
  }

  return where;
}