import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function PriceAlertModal({ product, isOpen, onClose }) {
  const { user } = useAuth();
  const [targetPrice, setTargetPrice] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!targetPrice || !email) {
      toast.error('Please fill in all fields');
      return;
    }

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (price >= product.price) {
      toast.error('Target price should be lower than current price');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const alert = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        currentPrice: product.price,
        targetPrice: price,
        email: email,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // Save to localStorage
      const saved = localStorage.getItem('priceAlerts');
      const alerts = saved ? JSON.parse(saved) : [];
      alerts.push(alert);
      localStorage.setItem('priceAlerts', JSON.stringify(alerts));

      setIsSubmitting(false);
      toast.success('Price alert set successfully! 📧');
      onClose();
    }, 1000);
  };

  const getDiscountPercentage = () => {
    if (!targetPrice) return 0;
    const price = parseFloat(targetPrice);
    if (isNaN(price)) return 0;
    return Math.round(((product.price - price) / product.price) * 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Set Price Alert</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-semibold text-white">{product.name}</h4>
                <p className="text-gray-400 text-sm">{product.brand}</p>
                <p className="text-lg font-bold gradient-text">₹{product.price.toLocaleString()}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Price (₹)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter your target price"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="0"
                  step="0.01"
                />
                {targetPrice && (
                  <p className="text-sm text-gray-400 mt-1">
                    You'll save ₹{(product.price - parseFloat(targetPrice) || 0).toLocaleString()} 
                    ({getDiscountPercentage()}% off)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                <h5 className="font-semibold text-blue-300 mb-2">📧 How it works:</h5>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• We'll monitor the price daily</li>
                  <li>• You'll get an email when price drops</li>
                  <li>• You can cancel alerts anytime</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  {isSubmitting ? 'Setting Alert...' : 'Set Price Alert'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-6 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 