import express from 'express';
import { protect } from '../middleware/auth';
import { createPaymentIntent, handleWebhook } from '../controllers/paymentController';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;