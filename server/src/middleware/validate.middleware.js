import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    throw new ApiError(400, errors.join(", "));
  }
  req.body = result.data;
  next();
};