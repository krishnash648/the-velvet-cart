import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    payment: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      toast('Your cart is empty! Start shopping 🎁');
      navigate('/');
    }
    if (!user) {
      toast('Please login to checkout');
      navigate('/');
    }
  }, [cart, navigate, user]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 299;
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + shipping + tax;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!form[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (form.payment === 'card') {
      if (!form.cardNumber || !form.cardExpiry || !form.cardCvv) {
        toast.error('Please fill in all card details');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order object
    const order = {
      items: cart,
      total: grandTotal,
      shipping: shipping,
      tax: tax,
      paymentMethod: form.payment,
      shippingAddress: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode
      }
    };

    // Add order to user history
    addOrder(order);

    toast.success('🎉 Order placed successfully!');
    clearCart();
    navigate('/');
    setIsProcessing(false);
  };

  const handleRazorpayPayment = () => {
    const options = {
      key: "rzp_test_SfyxaliFLVyZO2",
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      name: "The Velvet Cart",
      description: "Order Payment",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: form.firstName + ' ' + form.lastName,
        email: form.email,
        contact: form.phone
      },
      theme: {
        color: "#6366f1"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentMethods = [
    { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
    { id: 'upi', label: 'UPI / Digital Wallet', icon: '📱' },
    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦' }
  ];

  return (
    <motion.div
      className="min-h-screen bg-night text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <textarea
                    name="address"
                    rows="3"
                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                      value={form.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                      value={form.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 hover:bg-white/5 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={form.payment === method.id}
                      onChange={handleChange}
                      className="text-blush"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>

              {/* Card Details */}
              {form.payment === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-4 pt-4 border-t border-gray-600"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                        value={form.cardNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        name="cardCvv"
                        placeholder="123"
                        className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                        value={form.cardCvv}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush text-white"
                      value={form.cardExpiry}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                isProcessing 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-velvet hover:bg-purple-700 text-white hover:scale-105'
              }`}
              onClick={handleSubmit}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>

            <button onClick={handleRazorpayPayment} style={{marginTop: 16, padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer'}}>
              Pay with Razorpay
            </button>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-600 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : ''}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (18% GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blush">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mt-4">
                  <p className="text-green-400 text-sm">
                    Add ₹{(5000 - subtotal).toLocaleString()} more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
