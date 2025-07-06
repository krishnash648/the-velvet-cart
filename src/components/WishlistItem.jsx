import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

export default function WishlistItem({ product }) {
  const { removeFromWishlist } = useAuth();
  const { addToCart } = useCart();

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(product.id);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
    toast.success('Added to cart! 🛒');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    return stars.join('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300"
    >
      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-xl shadow-lg"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400 text-sm">{renderStars(product.rating)}</span>
                <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold gradient-text">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
                {product.isOnSale && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  product.stock > 10 ? 'bg-green-500/20 text-green-400' : 
                  product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRemoveFromWishlist}
                className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                title="Remove from wishlist"
              >
                ❌
              </button>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Link
              to={`/product/${product.id}`}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-xl text-center font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              View Details
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 ${
                product.stock === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 