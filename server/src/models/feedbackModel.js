import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Single source of truth for backend validation and queries
export const FeedbackCategory = {
  Product: "product",
  FeatureRequest: "feature_request",
  UIUX: "ui_ux",
  Support: "support",
  Billing: "billing",
  Other: "other",
};

export const FeedbackStatus = {
  Open: "open",
  Reviewed: "reviewed",
  Resolved: "resolved",
};

export const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    category: {
      type: DataTypes.ENUM(...Object.values(FeedbackCategory)),
      allowNull: false,
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 1000],
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    status: {
      type: DataTypes.ENUM(...Object.values(FeedbackStatus)),
      allowNull: false,
      defaultValue: FeedbackStatus.Open,
    },
  },
  {
    tableName: "feedbacks",
    timestamps: true,
    indexes: [
      { fields: ["category"] },
      { fields: ["status"] },
      { fields: ["createdAt"] },
    ],
  }
);

export default Feedback;