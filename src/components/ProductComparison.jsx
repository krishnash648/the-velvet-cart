import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

export default function ProductComparison() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [comparisonProducts, setComparisonProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('productComparison');
    if (saved) {
      setComparisonProducts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productComparison', JSON.stringify(comparisonProducts));
  }, [comparisonProducts]);

  const addToComparison = (product) => {
    if (comparisonProducts.length >= 4) {
      toast.error('You can compare up to 4 products at a time');
      return;
    }
    
    if (comparisonProducts.some(p => p.id === product.id)) {
      toast.error('Product is already in comparison');
      return;
    }
    
    setComparisonProducts(prev => [...prev, product]);
    toast.success('Added to comparison!');
  };

  const removeFromComparison = (productId) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId));
    toast.success('Removed from comparison');
  };

  const clearComparison = () => {
    setComparisonProducts([]);
    localStorage.removeItem('productComparison');
    toast.success('Comparison cleared');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;
      
      return (
        <span
          key={index}
          className={`text-sm ${isFilled ? 'text-yellow-400' : 'text-gray-400'}`}
        >
          {isFilled ? '★' : '☆'}
        </span>
      );
    });
  };

  const getComparisonFeatures = () => {
    const allFeatures = new Set();
    comparisonProducts.forEach(product => {
      product.features.forEach(feature => allFeatures.add(feature));
    });
    return Array.from(allFeatures);
  };

  if (comparisonProducts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold gradient-text">Product Comparison</h2>
          <div className="text-xl">⚖️</div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {comparisonProducts.length} product{comparisonProducts.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            {showComparison ? 'Hide' : 'Show'} Comparison
          </button>
          <button
            onClick={clearComparison}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Quick Comparison Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {comparisonProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-xl mb-3"
              />
              <button
                onClick={() => removeFromComparison(product.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-gray-400 text-xs mb-2">{product.brand}</p>
            
            <div className="flex items-center gap-1 mb-2">
              {renderStars(product.rating)}
              <span className="text-gray-400 text-xs">({product.reviews})</span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold gradient-text">₹{product.price.toLocaleString()}</span>
              {product.isOnSale && (
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Link
                to={`/product/${product.id}`}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-3 rounded-lg text-xs text-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                View
              </Link>
              <button
                onClick={() => addToCart({ ...product, quantity: 1 })}
                disabled={product.stock === 0}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 ${
                  product.stock === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Comparison Table */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 overflow-x-auto"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Detailed Comparison</h3>
            
            <div className="min-w-full">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-white font-semibold pb-4">Features</th>
                    {comparisonProducts.map((product) => (
                      <th key={product.id} className="text-center text-white font-semibold pb-4 min-w-[200px]">
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {/* Price */}
                  <tr>
                    <td className="text-gray-300 font-medium">Price</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="text-center">
                        <div className="text-lg font-bold gradient-text">₹{product.price.toLocaleString()}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="text-gray-300 font-medium">Rating</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="text-center">
                        <div className="flex justify-center gap-1 mb-1">
                          {renderStars(product.rating)}
                        </div>
                        <div className="text-sm text-gray-400">{product.rating} ({product.reviews} reviews)</div>
                      </td>
                    ))}
                  </tr>

                  {/* Stock */}
                  <tr>
                    <td className="text-gray-300 font-medium">Availability</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="text-center">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          product.stock > 10 ? 'bg-green-500/20 text-green-400' : 
                          product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Brand */}
                  <tr>
                    <td className="text-gray-300 font-medium">Brand</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="text-center text-white">
                        {product.brand}
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td className="text-gray-300 font-medium">Category</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="text-center text-white">
                        {product.category}
                      </td>
                    ))}
                  </tr>

                  {/* Features */}
                  {getComparisonFeatures().map((feature) => (
                    <tr key={feature}>
                      <td className="text-gray-300 font-medium">{feature}</td>
                      {comparisonProducts.map((product) => (
                        <td key={product.id} className="text-center">
                          <span className={`text-lg ${product.features.includes(feature) ? 'text-green-400' : 'text-gray-500'}`}>
                            {product.features.includes(feature) ? '✓' : '✗'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Export the function to add products to comparison
export const addToComparison = (product) => {
  const saved = localStorage.getItem('productComparison');
  const comparisonProducts = saved ? JSON.parse(saved) : [];
  
  if (comparisonProducts.length >= 4) {
    return false;
  }
  
  if (comparisonProducts.some(p => p.id === product.id)) {
    return false;
  }
  
  const updated = [...comparisonProducts, product];
  localStorage.setItem('productComparison', JSON.stringify(updated));
  return true;
}; 