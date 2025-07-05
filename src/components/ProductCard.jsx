import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const auth = useAuth();
  const { user, addToWishlist, removeFromWishlist, isInWishlist } = auth || {};
  const isListView = viewMode === 'list';
  
  const handleWishlistToggle = () => {
    if (!isInWishlist || !addToWishlist || !removeFromWishlist) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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

  if (isListView) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02, y: -2, boxShadow: '0 4px 16px 0 rgba(80, 0, 120, 0.10)' }}
        className="bg-white/10 backdrop-blur-xl rounded-xl shadow border border-white/10 transition-all duration-300 p-2 flex gap-3 items-center min-h-[110px] max-w-lg w-full"
      >
        <div className="relative flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-32 h-20 object-contain rounded-lg border border-white/10"
          />
          {product.isNew && (
            <span className="absolute top-1 left-1 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold shadow">NEW</span>
          )}
          {product.isOnSale && (
            <span className="absolute top-1 right-1 bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold shadow">-{product.discount}%</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="text-xs font-semibold text-white truncate">{product.name}</h3>
            <span className="text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-full ml-1">{product.category}</span>
          </div>
          <p className="text-[10px] text-gray-400 mb-0.5 truncate">{product.brand}</p>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-yellow-400 text-[10px]">{renderStars(product.rating)}</span>
            <span className="text-gray-400 text-[10px]">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm font-bold gradient-text">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold shadow ${
              product.stock > 10 ? 'bg-green-500/20 text-green-400' : 
              product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <motion.button
              onClick={handleWishlistToggle}
              className={`p-1 rounded-full transition-all duration-200 border border-white/10 ${
                isInWishlist && isInWishlist(product.id) 
                  ? 'bg-pink-500/20 text-pink-400' 
                  : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {isInWishlist && isInWishlist(product.id) ? '❤️' : '🤍'}
            </motion.button>
            <Link
              to={`/product/${product.id}`}
              className="px-2 py-1 rounded-full bg-gradient-to-r from-blush to-purple-600 text-white text-[10px] font-semibold shadow hover:scale-105 transition"
            >
              View
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.025, y: -3, boxShadow: '0 4px 16px 0 rgba(80, 0, 120, 0.10)' }}
      className="bg-white/10 backdrop-blur-xl rounded-xl shadow border border-white/10 transition-all duration-300 flex flex-col overflow-hidden min-h-[300px] max-w-sm w-72"
    >
      <div className="relative w-full flex justify-center items-center p-4" style={{ aspectRatio: '4/5', minHeight: '240px', maxHeight: '320px' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain object-center rounded-xl border border-white/20 p-2"
          style={{ aspectRatio: '4/5', minHeight: '240px', maxHeight: '320px' }}
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold shadow">NEW</span>
        )}
        {product.isOnSale && (
          <span className="absolute top-2 right-2 bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold shadow">-{product.discount}%</span>
        )}
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full border border-white/10">{product.category}</span>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-xs font-semibold text-white mb-0.5 line-clamp-2">{product.name}</h3>
        <p className="text-[10px] text-gray-400 mb-0.5">{product.brand}</p>
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-yellow-400 text-[10px]">{renderStars(product.rating)}</span>
          <span className="text-gray-400 text-[10px]">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-sm font-bold gradient-text">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-[10px] text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold shadow mb-1 w-fit ${
          product.stock > 10 ? 'bg-green-500/20 text-green-400' : 
          product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
        </span>
        <div className="flex items-center gap-1 mt-auto">
          <motion.button
            onClick={handleWishlistToggle}
            className={`p-1 rounded-full transition-all duration-200 border border-white/10 ${
              isInWishlist && isInWishlist(product.id) 
                ? 'bg-pink-500/20 text-pink-400' 
                : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {isInWishlist && isInWishlist(product.id) ? '❤️' : '🤍'}
          </motion.button>
          <Link
            to={`/product/${product.id}`}
            className="px-2 py-1 rounded-full bg-gradient-to-r from-blush to-purple-600 text-white text-[10px] font-semibold shadow hover:scale-105 transition"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
