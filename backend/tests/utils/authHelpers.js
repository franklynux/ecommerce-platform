import jwt from 'jsonwebtoken';
import User from '../../src/models/User.js';

const JWT_SECRET = 'test-jwt-secret';

export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  const user = await User.create({ ...defaultUser, ...userData });
  const token = jwt.sign({ id: user._id }, JWT_SECRET);

  return { user, token };
};