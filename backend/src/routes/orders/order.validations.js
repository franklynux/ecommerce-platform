import { body } from 'express-validator';

export const orderValidations = {
  create: [
    body('items').isArray().notEmpty().withMessage('Order must contain items'),
    body('items.*.product').isMongoId().withMessage('Valid product ID required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress').isObject().withMessage('Shipping address is required'),
    body('shippingAddress.street').notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.state').notEmpty().withMessage('State is required'),
    body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
    body('shippingAddress.country').notEmpty().withMessage('Country is required')
  ],
  updateStatus: [
    body('status').isIn(['processing', 'shipped', 'delivered'])
      .withMessage('Invalid status value')
  ]
};