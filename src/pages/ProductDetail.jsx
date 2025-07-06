import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import ReviewsSection from '../components/ReviewsSection';
import { addToRecentlyViewed } from '../components/RecentlyViewed';
import PriceAlertModal from '../components/PriceAlertModal';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  const product = products.find((p) => p.id === parseInt(id));

  // Add to recently viewed when product is loaded
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-night text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-400">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

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

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert('Quantity exceeds available stock!');
      return;
    }
    addToCart({ ...product, quantity });
  };

  return (
    <motion.div
      className="min-h-screen bg-night text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  NEW
                </span>
              )}
              {product.isOnSale && (
                <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{product.discount}% OFF
                </span>
              )}
            </motion.div>
            
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-blush' : 'border-gray-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4 mb-6">
     
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                  {product.brand.charAt(0)}
                </div>
                <span className="text-lg font-bold text-white tracking-wide">{product.brand} <span className="ml-2 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full font-semibold">Official Store</span></span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl">{renderStars(product.rating)}</span>
                <span className="text-gray-400 font-medium">{product.rating} ({product.reviews} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-xl shadow-sm">
                  <span className="text-lg">🚚</span>
                  <span className="text-xs font-semibold text-white">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-xl shadow-sm">
                  <span className="text-lg">🔄</span>
                  <span className="text-xs font-semibold text-white">Easy Returns</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-xl shadow-sm">
                  <span className="text-lg">🛡️</span>
                  <span className="text-xs font-semibold text-white">1-Year Warranty</span>
                </div>
              </div>
             
              <div className="flex gap-3 mt-2">
                <div className="flex items-center gap-2 bg-green-600/20 px-3 py-1 rounded-xl text-green-300 text-xs font-semibold">
                  <span>🔒</span> Secure Payment
                </div>
                <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1 rounded-xl text-blue-300 text-xs font-semibold">
                  <span>✅</span> Genuine Products
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-xl text-green-400" title="Share on WhatsApp">
                  <span>🟢</span>
                </button>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-xl text-blue-400" title="Share on Twitter">
                  <span>🐦</span>
                </button>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-xl text-gray-300" title="Copy Link" onClick={() => {navigator.clipboard.writeText(window.location.href)}}>
                  <span>🔗</span>
                </button>
                <button className="p-2 rounded-full bg-pink-600 hover:bg-pink-700 text-xl text-white shadow-lg" title="Add to Wishlist">
                  <span>❤️</span>
                </button>
                <button 
                  className="p-2 rounded-full bg-orange-600 hover:bg-orange-700 text-xl text-white shadow-lg" 
                  title="Set Price Alert"
                  onClick={() => setShowPriceAlert(true)}
                >
                  <span>📧</span>
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-400 text-lg mb-4">{product.brand}</p>
              

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-blush">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      Save ₹{(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

             
              <div className="space-y-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' : 
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 10 ? 'In Stock' : 
                   product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </span>
              </div>

           
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>

            
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-blush">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              
              <div className="space-y-4 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border border-gray-600 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-700 transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-600">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-700 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">Max: {product.stock}</span>
                </div>
                
      <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                    product.stock === 0 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-velvet hover:bg-purple-700 text-white hover:scale-105'
                  }`}
      >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
              </div>
            </div>
          </motion.div>
        </div>


        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <ReviewsSection productId={product.id} productName={product.name} />
        </motion.div>
      </div>

      <PriceAlertModal 
        product={product}
        isOpen={showPriceAlert}
        onClose={() => setShowPriceAlert(false)}
      />
    </motion.div>
  );
}
