import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, Package, CheckCircle2, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { cartService } from '../services/cartService';

const API_BASE = 'http://localhost:5000/api';
const SHIPPING_AMOUNT = 99;

// Simple field validation
function validateCheckout(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim() || !form.email.includes('@')) errors.email = 'Valid email is required';
  if (!form.phone.trim() || form.phone.length < 10) errors.phone = 'Valid phone number is required';
  if (!form.addressLine.trim()) errors.addressLine = 'Address is required';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.state.trim()) errors.state = 'State is required';
  if (!form.pinCode.trim() || !/^\d{6}$/.test(form.pinCode)) errors.pinCode = 'Valid 6-digit PIN code is required';
  return errors;
}

export default function CartCheckoutModal({ isOpen, onClose, onCartChange }) {
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'confirmed'
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', addressLine: '', city: '', state: '', pinCode: '' });
  const [errors, setErrors] = useState({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCartItems(cartService.getItems());
      setStep('cart');
      setConfirmedOrder(null);
      setApiError('');
      setErrors({});
    }
  }, [isOpen]);

  const updateCart = (newItems) => {
    setCartItems(newItems);
    onCartChange?.(newItems);
  };

  const subtotal = cartService.getSubtotal(cartItems);
  const total = subtotal + (cartItems.length > 0 ? SHIPPING_AMOUNT : 0);

  const handleIncrease = (productId) => updateCart(cartService.increaseQuantity(productId));
  const handleDecrease = (productId) => updateCart(cartService.decreaseQuantity(productId));
  const handleRemove   = (productId) => updateCart(cartService.removeItem(productId));

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    setStep('checkout');
    setApiError('');
  };

  const handlePlaceOrder = async () => {
    if (isPlacing) return; // Prevent duplicate submission

    const validationErrors = validateCheckout(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsPlacing(true);
    setApiError('');

    try {
      const payload = {
        items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
        customer: { name: form.name, email: form.email, phone: form.phone },
        shippingAddress: {
          addressLine: form.addressLine,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode
        }
      };

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setApiError(data.error || 'Unable to place your order. Please try again.');
        return;
      }

      // Save customer email for My Orders lookup
      try { localStorage.setItem('vr_customer_email', form.email); } catch {}

      // SUCCESS: clear cart only after backend confirms
      const cleared = cartService.clearCart();
      updateCart(cleared);

      setConfirmedOrder(data.data);
      setStep('confirmed');
    } catch (err) {
      setApiError('Unable to place your order right now. Please check your connection and try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-saffron-500 to-peacock-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="font-display font-bold text-lg">
                {step === 'cart' && `Shopping Cart (${cartItems.length} items)`}
                {step === 'checkout' && 'Checkout — Customer Details'}
                {step === 'confirmed' && 'Order Confirmed!'}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step: CART */}
          {step === 'cart' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto flex-1 p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-10">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                    <p className="text-xs text-gray-400 mt-1">Add handcrafted heritage products to get started.</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.productId} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/60">
                      <span className="text-3xl shrink-0">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{item.productName}</p>
                        <p className="text-xs text-gray-500 truncate">by {item.artisan} • {item.location}</p>
                        <p className="text-saffron-700 font-bold text-sm mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <button onClick={() => handleDecrease(item.productId)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => handleIncrease(item.productId)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleRemove(item.productId)} className="ml-2 text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-5 border-t border-gray-200 bg-gray-50/60 shrink-0">
                  <div className="space-y-1.5 text-sm mb-4">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Shipping</span><span>₹{SHIPPING_AMOUNT}</span></div>
                    <div className="flex justify-between font-bold text-gray-900 text-base pt-1.5 border-t border-gray-200"><span>Estimated Total</span><span>₹{total.toLocaleString()}</span></div>
                  </div>
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
                    ⚠️ Final total is calculated server-side from trusted pricing. Payment will be enabled in a future update.
                  </p>
                  <button onClick={handleProceedToCheckout} className="btn-primary w-full flex items-center justify-center space-x-2">
                    <span>Proceed to Checkout</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step: CHECKOUT */}
          {step === 'checkout' && (
            <div className="overflow-y-auto flex-1 p-5">
              {apiError && (
                <div className="flex items-start space-x-2 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{apiError}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Customer Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Customer Information</h3>
                  <div className="space-y-3">
                    {[
                      { field: 'name', label: 'Full Name', placeholder: 'Ravi Kumar', type: 'text' },
                      { field: 'email', label: 'Email Address', placeholder: 'ravi@example.com', type: 'email' },
                      { field: 'phone', label: 'Phone Number', placeholder: '9876543210', type: 'tel' }
                    ].map(({ field, label, placeholder, type }) => (
                      <div key={field}>
                        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                        <input
                          type={type}
                          value={form[field]}
                          onChange={e => handleFormChange(field, e.target.value)}
                          placeholder={placeholder}
                          className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                        {errors[field] && <p className="text-xs text-red-600 mt-1">{errors[field]}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Shipping Address</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Street Address / House No.</label>
                      <input
                        type="text"
                        value={form.addressLine}
                        onChange={e => handleFormChange('addressLine', e.target.value)}
                        placeholder="123 Artisan Lane, Heritage Colony"
                        className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none ${errors.addressLine ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.addressLine && <p className="text-xs text-red-600 mt-1">{errors.addressLine}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { field: 'city', label: 'City', placeholder: 'Mumbai' },
                        { field: 'state', label: 'State', placeholder: 'Maharashtra' }
                      ].map(({ field, label, placeholder }) => (
                        <div key={field}>
                          <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                          <input
                            type="text"
                            value={form[field]}
                            onChange={e => handleFormChange(field, e.target.value)}
                            placeholder={placeholder}
                            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          />
                          {errors[field] && <p className="text-xs text-red-600 mt-1">{errors[field]}</p>}
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={form.pinCode}
                        maxLength={6}
                        onChange={e => handleFormChange('pinCode', e.target.value.replace(/\D/g, ''))}
                        placeholder="400001"
                        className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none ${errors.pinCode ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.pinCode && <p className="text-xs text-red-600 mt-1">{errors.pinCode}</p>}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-saffron-50 border border-saffron-100 rounded-2xl p-4 text-sm space-y-2">
                  <h3 className="font-bold text-gray-900 mb-2">Order Summary ({cartItems.length} items)</h3>
                  {cartItems.map(i => (
                    <div key={i.productId} className="flex justify-between text-gray-700">
                      <span className="truncate max-w-[180px]">{i.productName} × {i.quantity}</span>
                      <span>₹{(i.price * i.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-gray-600 pt-1 border-t border-saffron-200">
                    <span>Shipping</span><span>₹{SHIPPING_AMOUNT}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base">
                    <span>Total (estimated)</span><span>₹{total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500">Final total confirmed by server. Payment is pending.</p>
                </div>

                <div className="flex space-x-3">
                  <button onClick={() => setStep('cart')} className="btn-secondary flex-1 text-sm py-3">
                    ← Back to Cart
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="btn-primary flex-1 text-sm py-3 flex items-center justify-center space-x-2 disabled:opacity-60"
                  >
                    {isPlacing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Placing Order...</span>
                      </>
                    ) : (
                      <span>Place Order</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step: CONFIRMED */}
          {step === 'confirmed' && confirmedOrder && (
            <div className="overflow-y-auto flex-1 p-6 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-gray-900">Order Placed Successfully!</h3>
                <p className="text-sm text-gray-600 mt-1">Your heritage order has been received and confirmed.</p>
              </div>

              <div className="bg-saffron-50 border border-saffron-200 rounded-2xl p-5 text-left space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-bold text-saffron-700">{confirmedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-xs text-gray-500 break-all">{confirmedOrder.orderId?.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Server Total</span>
                  <span className="font-bold text-gray-900">₹{confirmedOrder.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-semibold">Pending Payment</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-semibold">Pending</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 text-left">
                <Package className="w-4 h-4 inline mr-1 text-amber-600" />
                Payment integration coming soon. Your order is saved and will be processed after payment confirmation.
              </div>

              <button onClick={onClose} className="btn-primary w-full">
                Continue Shopping
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
