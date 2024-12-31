import Order from '../../models/Order';
import Product from '../../models/Product';
import { formatResponse } from '../../utils/responseFormatter';
import { OrderService } from './order.service';

export const orderController = {
  // List and Search Methods
  async getOrders(req, res, next) {
    try {
      const { status, limit = 10, page = 1 } = req.query;
      const query = status ? { status } : {};
      
      const [orders, total] = await Promise.all([
        Order.find(query)
          .populate('user', 'name email')
          .populate('items.product', 'name price')
          .limit(parseInt(limit))
          .skip((page - 1) * limit)
          .sort({ createdAt: -1 }),
        Order.countDocuments(query)
      ]);
      
      res.json(formatResponse('success', {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }));
    } catch (error) {
      next(error);
    }
  },

  async getMyOrders(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const query = { user: req.user._id };

      const [orders, total] = await Promise.all([
        Order.find(query)
          .populate('items.product', 'name price imageUrl')
          .limit(parseInt(limit))
          .skip((page - 1) * limit)
          .sort({ createdAt: -1 }),
        Order.countDocuments(query)
      ]);

      res.json(formatResponse('success', {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }));
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req, res, next) {
    try {
      const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.product', 'name price');
        
      if (!order) {
        return res.status(404).json(
          formatResponse('error', null, 'Order not found')
        );
      }

      // Check if user is authorized to view this order
      if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json(
          formatResponse('error', null, 'Not authorized to view this order')
        );
      }

      res.json(formatResponse('success', order));
    } catch (error) {
      next(error);
    }
  },

  async createOrder(req, res, next) {
    try {
      const { items, shippingAddress } = req.body;
      
      // Use OrderService to handle business logic
      const orderData = await OrderService.validateAndPrepareOrder(items);
      
      const order = new Order({
        user: req.user._id,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        shippingAddress
      });

      await order.save();
      await OrderService.updateProductStock(items); // Update stock levels

      res.status(201).json(
        formatResponse('success', order, 'Order created successfully')
      );
    } catch (error) {
      next(error);
    }
  },

  async updateOrderStatus(req, res, next) {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json(
          formatResponse('error', null, 'Order not found')
        );
      }

      // Check if user is authorized to update this order
      if (!req.user.isAdmin) {
        return res.status(403).json(
          formatResponse('error', null, 'Not authorized to update order status')
        );
      }

      order.status = status;
      await order.save();

      res.json(formatResponse('success', order, 'Order status updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async cancelOrder(req, res, next) {
    try {
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json(
          formatResponse('error', null, 'Order not found')
        );
      }

      // Check if user is authorized to cancel this order
      if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json(
          formatResponse('error', null, 'Not authorized to cancel this order')
        );
      }

      if (order.status !== 'pending') {
        return res.status(400).json(
          formatResponse('error', null, 'Only pending orders can be cancelled')
        );
      }

      await OrderService.restoreProductStock(order.items);
      order.status = 'cancelled';
      await order.save();

      res.json(formatResponse('success', order, 'Order cancelled successfully'));
    } catch (error) {
      next(error);
    }
  }
};