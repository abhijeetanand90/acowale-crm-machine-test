import httpErrors from "http-errors";

export function ValidationError(message = "Validation failed") {
  return httpErrors(422, message, {
    id: "validation_error",
  });
}

export function NotFoundError(resource = "Resource") {
  return httpErrors(404, `${resource} not found`, {
    id: "not_found",
  });
}

export function InvalidInputError(message = "Invalid input") {
  return httpErrors(400, message, {
    id: "invalid_input",
  });
}