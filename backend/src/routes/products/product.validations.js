import { body } from 'express-validator';

export const productValidations = {
  create: [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isIn(['toys', 'food', 'accessories', 'clothing'])
      .withMessage('Invalid category'),
    body('imageUrl').isURL().withMessage('Valid image URL is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ],
  update: [
    body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').optional().isIn(['toys', 'food', 'accessories', 'clothing'])
      .withMessage('Invalid category'),
    body('imageUrl').optional().isURL().withMessage('Valid image URL is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ]
};