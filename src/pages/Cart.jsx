import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subtotal = total;
  const shipping = total > 5000 ? 0 : 299;
  const tax = total * 0.18; 
  const grandTotal = subtotal + shipping + tax;

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };

  if (cart.length === 0) {
    return (
      <motion.div
        className="min-h-screen bg-night text-white flex items-center justify-center p-6 particles"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center max-w-md">
          <motion.div 
            className="text-8xl mb-6 animate-bounce-slow"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🛒
          </motion.div>
          <h1 className="text-4xl font-bold mb-6 gradient-text">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8 text-lg">
            Looks like you haven't added any items to your cart yet. 
            Start shopping to discover amazing products!
          </p>
          <Link
            to="/"
            className="btn-sexy inline-block text-lg px-10 py-4"
          >
            Start Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-night text-white p-6 particles"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold gradient-text">Shopping Cart</h1>
              <button
                onClick={clearCart}
                className="text-red-400 hover:text-red-300 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"
              >
                Clear Cart
              </button>
            </div>

            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="cart-sexy mb-6"
                >
                  <div className="flex gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl shadow-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-white">{item.name}</h3>
                          <p className="text-gray-400 text-sm mb-2">{item.brand}</p>
                          <p className="text-blush font-semibold gradient-text">₹{item.price.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-400">Quantity:</label>
                          <div className="flex items-center border border-gray-600 rounded-xl bg-white/5">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-4 py-2 hover:bg-white/10 transition-colors rounded-l-xl"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-4 py-2 border-x border-gray-600">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-4 py-2 hover:bg-white/10 transition-colors rounded-r-xl"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold gradient-text">₹{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-sm text-gray-400">₹{item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="cart-sexy sticky top-6"
            >
              <h2 className="text-2xl font-bold mb-6 gradient-text">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({cart.length} items)</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400 glow-text' : 'text-white'}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (18% GST)</span>
                  <span className="text-white">₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-white">Total</span>
                    <span className="gradient-text glow-text">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6 glow">
                  <p className="text-green-400 text-sm">
                    Add ₹{(5000 - subtotal).toLocaleString()} more for free shipping!
                  </p>
                </div>
              )}

              <Link
                to="/checkout"
                className="btn-sexy w-full text-center block mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="w-full bg-transparent border border-gray-600 text-white py-3 px-6 rounded-xl hover:bg-white/10 transition-all duration-300 font-medium text-center block"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
