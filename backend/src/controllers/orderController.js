// backend/src/controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { AppError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('items.product');
  
  res.json({
    status: 'success',
    data: { orders }
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product');
    
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  
  res.json({
    status: 'success',
    data: { order }
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;
  
  // Calculate total and verify stock
  let totalAmount = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new AppError(`Product ${item.product} not found`, 404);
    }
    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }
    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    items,
    totalAmount,
    shippingAddress,
    status: 'pending'
  });

  res.status(201).json({
    status: 'success',
    data: { order }
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({
    status: 'success',
    data: { order }
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.status !== 'pending') {
    throw new AppError('Only pending orders can be cancelled', 400);
  }

  order.status = 'cancelled';
  await order.save();

  res.json({
    status: 'success',
    data: { order }
  });
});