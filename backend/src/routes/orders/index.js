import express from 'express';
import { orderValidations } from './order.validations';
import { orderController } from './order.controller';
import { validate } from '../../middleware/validation';
import { auth } from '../../middleware/auth';

const router = express.Router();

// List and Search routes
router.get('/', auth, orderController.getOrders);
router.get('/my-orders', auth, orderController.getMyOrders);

// Individual order routes
router.get('/:id', auth, orderController.getOrderById);
router.post('/', auth, validate(orderValidations.create), orderController.createOrder);
router.patch('/:id/status', auth, validate(orderValidations.updateStatus), orderController.updateOrderStatus);
router.patch('/:id/cancel', auth, orderController.cancelOrder);

export default router;