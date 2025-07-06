import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
  const { user } = useAuth();
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const loadRecentlyViewed = () => {
      const key = user ? `recentlyViewed_${user.uid}` : 'recentlyViewed_guest';
      const saved = localStorage.getItem(key);
      if (saved) {
        setRecentlyViewed(JSON.parse(saved));
      }
    };

    loadRecentlyViewed();
  }, [user]);

  const addToRecentlyViewed = (product) => {
    const key = user ? `recentlyViewed_${user.uid}` : 'recentlyViewed_guest';
    
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 8); // Keep only 8 most recent
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    const key = user ? `recentlyViewed_${user.uid}` : 'recentlyViewed_guest';
    localStorage.removeItem(key);
    setRecentlyViewed([]);
  };

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-12"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold gradient-text">Recently Viewed</h2>
          <div className="text-xl">👁️</div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {recentlyViewed.length} product{recentlyViewed.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={clearRecentlyViewed}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
            title="Clear recently viewed"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recentlyViewed.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <ProductCard product={product} viewMode="grid" />
          </motion.div>
        ))}
      </div>

      {recentlyViewed.length > 6 && (
        <div className="text-center mt-6">
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      )}
    </motion.div>
  );
}

// Export the function to add products to recently viewed
export const addToRecentlyViewed = (product) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const key = user ? `recentlyViewed_${user.uid}` : 'recentlyViewed_guest';
  
  const saved = localStorage.getItem(key);
  const recentlyViewed = saved ? JSON.parse(saved) : [];
  
  const filtered = recentlyViewed.filter(p => p.id !== product.id);
  const updated = [product, ...filtered].slice(0, 8);
  
  localStorage.setItem(key, JSON.stringify(updated));
}; 