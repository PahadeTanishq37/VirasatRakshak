/**
 * VirasatRakshak Order Controller
 * Handles POST /api/orders, GET /api/orders/my, GET /api/orders/:id
 */

import { orderService } from '../services/order.service.js';

// POST /api/orders — Create a new order
export const createOrder = (req, res) => {
  try {
    const { items, customer, shippingAddress } = req.body;

    const order = orderService.createOrder({ items, customer, shippingAddress });

    return res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        shippingAmount: order.shippingAmount,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt
      },
      message: 'Order created successfully. Payment is pending.'
    });
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Failed to create order. Please try again.';
    return res.status(status).json({ success: false, error: message });
  }
};

// GET /api/orders/my — Get all orders for a customer (identified by email query param)
export const getMyOrders = (req, res) => {
  try {
    const email = req.query.email;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid customer email is required to fetch orders.' });
    }

    const orders = orderService.getOrdersByEmail(email);

    return res.status(200).json({
      success: true,
      data: orders.map(o => ({
        orderId: o.id,
        orderNumber: o.orderNumber,
        itemCount: o.items.length,
        subtotal: o.subtotal,
        shippingAmount: o.shippingAmount,
        totalAmount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt
      }))
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch orders.' });
  }
};

// GET /api/orders/:id — Get a single order (with email-based ownership check)
export const getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    const email = req.query.email;

    if (!id) {
      return res.status(400).json({ success: false, error: 'Order ID is required.' });
    }

    const order = orderService.getOrderById(id, email);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }
    if (order === 'forbidden') {
      return res.status(403).json({ success: false, error: 'Access denied. You can only view your own orders.' });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch order details.' });
  }
};
