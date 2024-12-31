import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User';
import { AppError } from '../utils/errors';
import config from '../config/environment';

export const protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Please log in to access this resource', 401);
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, config.jwtSecret);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    throw new AppError('Please verify your email address to access this resource', 403);
  }
  next();
};