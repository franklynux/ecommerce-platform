import { formatResponse } from '../utils/responseFormatter';
import Payment from '../models/Payment';
import Order from '../models/Order';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    // Fetch order details
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
      },
    });

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      amount: order.totalAmount,
      currency: 'USD',
      paymentMethod: 'card',
      paymentIntentId: paymentIntent.id,
    });
    await payment.save();

    // Return client secret
    res.json(formatResponse('success', {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    }));
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      // Handle other webhook events as needed
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

const handlePaymentSuccess = async (paymentIntent) => {
  const payment = await Payment.findOne({ paymentIntentId: paymentIntent.id });
  if (!payment) return;

  payment.status = 'completed';
  await payment.save();

  // Update order status
  const order = await Order.findById(payment.orderId);
  if (order) {
    order.status = 'processing';
    order.paymentStatus = 'paid';
    await order.save();
  }
};

const handlePaymentFailure = async (paymentIntent) => {
  const payment = await Payment.findOne({ paymentIntentId: paymentIntent.id });
  if (!payment) return;

  payment.status = 'failed';
  payment.errorMessage = paymentIntent.last_payment_error?.message;
  await payment.save();

  // Update order status
  const order = await Order.findById(payment.orderId);
  if (order) {
    order.paymentStatus = 'failed';
    await order.save();
  }
};