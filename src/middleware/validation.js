import { validationResult } from "express-validator";

const validationMiddleWare = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: result.array() });
};

export { validationMiddleWare };
