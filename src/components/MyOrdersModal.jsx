import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle2, AlertCircle, RefreshCw, ChevronDown, ChevronUp, X, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const STATUS_COLORS = {
  pending_payment: 'bg-amber-100 text-amber-800',
  paid: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800'
};

const STATUS_LABELS = {
  pending_payment: 'Pending Payment',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export default function MyOrdersModal({ isOpen, onClose }) {
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem('vr_customer_email') || ''; } catch { return ''; }
  });
  const [emailInput, setEmailInput] = useState(email);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    if (isOpen && email) {
      fetchOrders(email);
    }
  }, [isOpen]);

  const fetchOrders = async (customerEmail) => {
    if (!customerEmail || !customerEmail.includes('@')) {
      setError('Enter your email address to view your orders.');
      return;
    }
    setIsLoading(true);
    setError('');
    setOrders([]);

    try {
      const res = await fetch(`${API_BASE}/orders/my?email=${encodeURIComponent(customerEmail)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to load orders.');
        return;
      }

      setOrders(data.data || []);
      try { localStorage.setItem('vr_customer_email', customerEmail); } catch {}
    } catch (e) {
      setError('Unable to connect to the server. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setOrderDetail(null);
      return;
    }

    setExpandedOrderId(orderId);
    setIsLoadingDetail(true);
    setOrderDetail(null);

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setOrderDetail({ error: data.error || 'Failed to load order details.' });
        return;
      }
      setOrderDetail(data.data);
    } catch (e) {
      setOrderDetail({ error: 'Unable to load order details.' });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setEmail(emailInput);
    fetchOrders(emailInput);
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
          <div className="p-5 bg-gradient-to-r from-peacock-600 to-saffron-500 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5" />
              <h2 className="font-display font-bold text-lg">My Heritage Orders</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Email lookup form */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 shrink-0">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="Enter your email to view orders"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron-500 outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary text-sm px-4 py-2 flex items-center space-x-1.5 disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>Load</span>
              </button>
            </form>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-5 space-y-4">
            {/* Error */}
            {error && (
              <div className="flex items-start space-x-2 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading spinner */}
            {isLoading && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-saffron-500 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Loading your orders...</p>
              </div>
            )}

            {/* No orders */}
            {!isLoading && !error && email && orders.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No orders found</p>
                <p className="text-xs text-gray-400 mt-1">Orders placed with this email will appear here.</p>
              </div>
            )}

            {/* Order list */}
            {!isLoading && orders.map(order => (
              <div key={order.orderId} className="border border-gray-200 rounded-2xl overflow-hidden">
                {/* Order summary row */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fetchOrderDetail(order.orderId)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-saffron-700 text-sm">{order.orderNumber}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.itemCount} item{order.itemCount !== 1 ? 's' : ''} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="font-bold text-gray-900 text-sm">₹{order.totalAmount?.toLocaleString()}</div>
                    <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Payment: Pending</div>
                  </div>
                  <div className="ml-3 text-gray-400">
                    {expandedOrderId === order.orderId ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Order detail expansion */}
                <AnimatePresence>
                  {expandedOrderId === order.orderId && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 p-4 bg-gray-50 text-sm space-y-4">
                        {isLoadingDetail && (
                          <div className="flex justify-center py-4">
                            <Loader2 className="w-5 h-5 text-saffron-500 animate-spin" />
                          </div>
                        )}

                        {orderDetail?.error && (
                          <p className="text-red-600 text-xs">{orderDetail.error}</p>
                        )}

                        {orderDetail && !orderDetail.error && (
                          <>
                            {/* Items */}
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-wide">Order Items</h4>
                              <div className="space-y-2">
                                {orderDetail.items?.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center bg-white border border-gray-100 rounded-xl px-3 py-2">
                                    <div>
                                      <p className="font-semibold text-gray-900 text-sm">{item.productNameSnapshot}</p>
                                      <p className="text-xs text-gray-500">by {item.artisanSnapshot} — Qty: {item.quantity} × ₹{item.unitPrice?.toLocaleString()}</p>
                                    </div>
                                    <p className="font-bold text-gray-900 text-sm">₹{item.lineTotal?.toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Totals */}
                            <div className="bg-white border border-saffron-100 rounded-xl p-3 space-y-1.5">
                              <div className="flex justify-between text-gray-600 text-xs"><span>Subtotal</span><span>₹{orderDetail.subtotal?.toLocaleString()}</span></div>
                              <div className="flex justify-between text-gray-600 text-xs"><span>Shipping</span><span>₹{orderDetail.shippingAmount?.toLocaleString()}</span></div>
                              <div className="flex justify-between font-bold text-gray-900 text-sm border-t border-gray-100 pt-1.5"><span>Total</span><span>₹{orderDetail.totalAmount?.toLocaleString()}</span></div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1 text-xs uppercase tracking-wide">Shipping Address</h4>
                              <p className="text-gray-600 text-xs leading-relaxed">
                                {orderDetail.shippingAddress?.addressLine}<br />
                                {orderDetail.shippingAddress?.city}, {orderDetail.shippingAddress?.state} — {orderDetail.shippingAddress?.pinCode}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
