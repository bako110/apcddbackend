import { sendError } from '../utils/apiResponse.js';

export function validateRequest(schema) {
  return function validate(req, res, next) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      sendError(res, 'Validation failed', 400, details);
      return;
    }

    req.body = result.data;
    next();
  };
}
