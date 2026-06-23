import { ZodError } from "zod";
import { ValidationError } from "../errors/index.js";

function createValidator(source, schema) {
  return function validateMiddleware(req, res, next) {
    try {
      const result = schema.parse(req[source]);

      req.validated = {
        ...(req.validated ?? {}),
        [source]: result,
      };

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstIssue = error.issues[0];
        const field =
          firstIssue.path.length > 0
            ? String(firstIssue.path[firstIssue.path.length - 1])
            : null;

        const message = field
          ? `${field}: ${firstIssue.message}`
          : firstIssue.message;

        return next(ValidationError(message));
      }

      
      return next(error);
    }
  };
}

export function validateBody(schema) {
  return createValidator("body", schema);
}

export function validateParams(schema) {
  return createValidator("params", schema);
}

export function validateQuery(schema) {
  return createValidator("query", schema);
}