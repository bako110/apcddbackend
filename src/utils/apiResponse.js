export function sendSuccess(res, data, status = 200) {
  return res.status(status).json(data);
}

export function sendError(res, message, status = 400, details) {
  const body = { error: message };
  if (details !== undefined) {
    body.details = details;
  }
  return res.status(status).json(body);
}
