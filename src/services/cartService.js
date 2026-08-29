/**
 * VirasatRakshak Cart Service (Frontend)
 * Cart is client-side (localStorage), but orders are persisted on the backend.
 * 
 * Cart Shape per item:
 * { productId, productName, price, quantity, image, artisan, location }
 */

const CART_KEY = 'virasat_cart_v1';

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be blocked in some contexts
  }
}

export const cartService = {
  // Get all cart items
  getItems() {
    return readCart();
  },

  // Add item or increase quantity if already in cart
  addItem(product) {
    const items = readCart();
    const idx = items.findIndex(i => i.productId === product.id);
    if (idx >= 0) {
      items[idx].quantity = Math.min(10, items[idx].quantity + 1);
    } else {
      items.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        artisan: product.artisan,
        location: product.location
      });
    }
    writeCart(items);
    return items;
  },

  // Remove item by productId
  removeItem(productId) {
    const items = readCart().filter(i => i.productId !== productId);
    writeCart(items);
    return items;
  },

  // Increase quantity for a productId
  increaseQuantity(productId) {
    const items = readCart().map(i =>
      i.productId === productId
        ? { ...i, quantity: Math.min(10, i.quantity + 1) }
        : i
    );
    writeCart(items);
    return items;
  },

  // Decrease quantity — removes item if quantity hits 0
  decreaseQuantity(productId) {
    const items = readCart()
      .map(i => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0);
    writeCart(items);
    return items;
  },

  // Set exact quantity (clamped 1–10)
  setQuantity(productId, qty) {
    const quantity = Math.max(1, Math.min(10, Number(qty) || 1));
    const items = readCart().map(i =>
      i.productId === productId ? { ...i, quantity } : i
    );
    writeCart(items);
    return items;
  },

  // Clear the entire cart
  clearCart() {
    writeCart([]);
    return [];
  },

  // Calculate cart subtotal (display only — server recalculates authoritative total)
  getSubtotal(items) {
    return (items || readCart()).reduce((sum, i) => sum + (i.price * i.quantity), 0);
  },

  // Total item count
  getTotalQuantity(items) {
    return (items || readCart()).reduce((sum, i) => sum + i.quantity, 0);
  }
};
