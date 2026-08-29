/**
 * VirasatRakshak Order Service
 * Server-side order management with authoritative pricing from trusted product catalog.
 * Orders are stored in-memory (Map) — no database dependency added in this task.
 * This architecture allows clean DB migration later.
 */

import crypto from 'crypto';

// =====================================================================
// TRUSTED PRODUCT CATALOG (Server-side — cannot be tampered by client)
// =====================================================================
const TRUSTED_PRODUCTS = {
  1:  { id: 1, name: 'Handwoven Banarasi Saree',      price: 8500,  artisan: 'Priya Sharma',   artisanLocation: 'Varanasi, Uttar Pradesh',  inStock: true },
  2:  { id: 2, name: 'Blue Pottery Set',              price: 2500,  artisan: 'Rajesh Kumar',   artisanLocation: 'Jaipur, Rajasthan',         inStock: true },
  3:  { id: 3, name: 'Kashmiri Pashmina Shawl',       price: 15000, artisan: 'Amina Begum',    artisanLocation: 'Srinagar, J&K',            inStock: true },
  4:  { id: 4, name: 'Madhubani Painting',            price: 3500,  artisan: 'Sita Devi',      artisanLocation: 'Madhubani, Bihar',         inStock: true },
  5:  { id: 5, name: 'Kerala Spice Box',              price: 1200,  artisan: 'Krishnan Nair',  artisanLocation: 'Kochi, Kerala',            inStock: true },
  6:  { id: 6, name: 'Gujarati Silver Jewelry',       price: 4500,  artisan: 'Harshad Patel',  artisanLocation: 'Ahmedabad, Gujarat',       inStock: false },
  7:  { id: 7, name: 'Tamil Nadu Bronze Idol',        price: 6800,  artisan: 'Murugan Swamy',  artisanLocation: 'Thanjavur, Tamil Nadu',    inStock: true },
  8:  { id: 8, name: 'Bengali Terracotta Pot',        price: 1800,  artisan: 'Gopal Das',      artisanLocation: 'Kolkata, West Bengal',     inStock: true },
  9:  { id: 9, name: 'Punjabi Phulkari Dupatta',      price: 3200,  artisan: 'Kiran Kaur',     artisanLocation: 'Amritsar, Punjab',         inStock: true },
  10: { id: 10, name: 'Maharashtrian Warli Art',      price: 2200,  artisan: 'Sunita Pawar',   artisanLocation: 'Mumbai, Maharashtra',      inStock: true },
  11: { id: 11, name: 'Karnataka Sandalwood Carving', price: 5500,  artisan: 'Ravi Shastri',   artisanLocation: 'Mysore, Karnataka',        inStock: true },
  12: { id: 12, name: 'Odisha Pattachitra',           price: 2800,  artisan: 'Bijay Kumar',    artisanLocation: 'Puri, Odisha',             inStock: true },
};

const SHIPPING_AMOUNT = 99; // Fixed shipping fee in INR

// In-memory order store (Map: orderId -> OrderDocument)
const ordersStore = new Map();

// Sequential counter for order numbers
let orderCounter = 1;

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

function generateOrderId() {
  return crypto.randomUUID();
}

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const seq = String(orderCounter++).padStart(6, '0');
  return `VR-${year}-${seq}`;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

// =====================================================================
// ORDER SERVICE METHODS
// =====================================================================

export const orderService = {

  /**
   * Look up a product from the trusted catalog.
   */
  getProduct(productId) {
    return TRUSTED_PRODUCTS[Number(productId)] || null;
  },

  /**
   * Create a new order.
   * @param {Array} items — [{ productId, quantity }]
   * @param {Object} customer — { name, email, phone }
   * @param {Object} shippingAddress — { addressLine, city, state, pinCode }
   * @returns {Object} created order
   */
  createOrder({ items, customer, shippingAddress }) {
    // --- Validate items ---
    if (!Array.isArray(items) || items.length === 0) {
      throw { status: 400, message: 'Order must contain at least one item.' };
    }

    // --- Validate customer ---
    const customerName  = sanitizeString(customer?.name);
    const customerEmail = sanitizeString(customer?.email);
    const customerPhone = sanitizeString(customer?.phone);

    if (!customerName)  throw { status: 400, message: 'Customer name is required.' };
    if (!customerEmail || !customerEmail.includes('@')) throw { status: 400, message: 'Valid customer email is required.' };
    if (!customerPhone) throw { status: 400, message: 'Customer phone is required.' };

    // --- Validate shipping ---
    const addressLine = sanitizeString(shippingAddress?.addressLine);
    const city        = sanitizeString(shippingAddress?.city);
    const state       = sanitizeString(shippingAddress?.state);
    const pinCode     = sanitizeString(shippingAddress?.pinCode);

    if (!addressLine) throw { status: 400, message: 'Shipping address line is required.' };
    if (!city)        throw { status: 400, message: 'City is required.' };
    if (!state)       throw { status: 400, message: 'State is required.' };
    if (!pinCode || !/^\d{6}$/.test(pinCode)) throw { status: 400, message: 'Valid 6-digit PIN code is required.' };

    // --- Validate items and compute authoritative totals ---
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity  = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw { status: 400, message: `Invalid quantity for product ${productId}.` };
      }
      if (quantity > 10) {
        throw { status: 400, message: `Maximum 10 units per product. Reduce quantity for product ${productId}.` };
      }

      const product = TRUSTED_PRODUCTS[productId];
      if (!product) {
        throw { status: 400, message: `Product with ID ${productId} does not exist.` };
      }
      if (!product.inStock) {
        throw { status: 400, message: `"${product.name}" is currently out of stock.` };
      }

      const unitPrice = product.price; // Authoritative from server
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      orderItems.push({
        productId,
        productNameSnapshot: product.name,
        artisanSnapshot: product.artisan,
        artisanLocationSnapshot: product.artisanLocation,
        quantity,
        unitPrice,
        lineTotal
      });
    }

    const totalAmount = subtotal + SHIPPING_AMOUNT;

    // --- Build and persist order ---
    const orderId = generateOrderId();
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const order = {
      id: orderId,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: { addressLine, city, state, pinCode },
      items: orderItems,
      subtotal,
      shippingAmount: SHIPPING_AMOUNT,
      totalAmount,
      status: 'pending_payment',        // Starts as payment-pending; Razorpay task will update
      paymentStatus: 'pending',         // Never set to "paid" by frontend
      createdAt: now,
      updatedAt: now
    };

    ordersStore.set(orderId, order);

    console.log(`[OrderService] Created order ${orderNumber} | Total: Rs.${totalAmount} | Customer: ${customerEmail}`);
    return order;
  },

  /**
   * Get all orders for a customer by email.
   */
  getOrdersByEmail(email) {
    const customerEmail = sanitizeString(email).toLowerCase();
    const orders = [];
    for (const order of ordersStore.values()) {
      if (order.customerEmail.toLowerCase() === customerEmail) {
        orders.push(order);
      }
    }
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Get a single order by ID (with ownership check by email).
   */
  getOrderById(orderId, customerEmail) {
    const order = ordersStore.get(orderId);
    if (!order) return null;

    // Ownership check: only the customer who placed the order can retrieve it
    if (customerEmail && order.customerEmail.toLowerCase() !== customerEmail.toLowerCase()) {
      return 'forbidden';
    }
    return order;
  },

  /**
   * List all orders (admin use — no ownership check)
   */
  getAllOrders() {
    return Array.from(ordersStore.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Get total number of orders in store
   */
  getOrderCount() {
    return ordersStore.size;
  }
};
