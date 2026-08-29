/**
 * VirasatRakshak Marketplace Order Routes
 * POST /api/orders       — Create a new order
 * GET  /api/orders/my    — Get orders for a customer by email query param
 * GET  /api/orders/:id   — Get a single order by ID (with ownership check)
 */

import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/order.controller.js';

const router = Router();

router.post('/orders', createOrder);
router.get('/orders/my', getMyOrders);
router.get('/orders/:id', getOrderById);

export default router;
