import { validationResult } from 'express-validator';
import { AppError } from './errors';

export const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    throw new AppError(errorMessages[0], 400);
  }
  next();
};