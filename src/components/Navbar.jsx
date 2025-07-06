import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout, wishlist } = useAuth();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <motion.nav 
      className="sticky top-0 z-50 navbar-sexy"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-lg group-hover:scale-110 transition-transform duration-300"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/the-velvet-cart/logo.png" 
                alt="Velvet Cart Logo" 
                className="w-8 h-8 object-contain"
              />
            </motion.div>
            <span className="text-xl font-bold tracking-wide gradient-text-animated">
              Velvet Cart
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/products" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Products
            </Link>
            <Link 
              to="/categories" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
            >
              About
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white/10 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blush text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  🔍
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              🔍
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <motion.div 
                className="relative p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group-hover:scale-110"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-2xl">🛒</div>
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-blush to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold glow"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto shadow-2xl">
                <div className="text-sm text-gray-300 mb-2">
                  {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
                </div>
                <div className="text-lg font-bold gradient-text">
                  ₹{totalValue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Click to view cart
                </div>
              </div>
            </Link>

            {user ? (
              <div className="relative group">
                <motion.button 
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group-hover:scale-105"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blush to-purple-600 rounded-full flex items-center justify-center text-white font-bold glow">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                  <span className="hidden md:block text-sm text-gray-300">{user.firstName}</span>
                </motion.button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto shadow-2xl">
                  <div className="p-2">
                    <Link to="/profile" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                      Profile
                    </Link>
                    <Link to="/profile" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                      Orders ({user.orders?.length || 0})
                    </Link>
                    <Link to="/profile" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                      Wishlist ({wishlist?.length || 0})
                    </Link>
                    <hr className="border-gray-600 my-1" />
                    <button 
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-2xl text-white transition-all duration-300"
                onClick={() => setAuthModalOpen(true)}
                aria-label="Sign in or register"
              >
                <span role="img" aria-label="user">👤</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden py-4 border-t border-white/10"
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-white/10 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blush text-white placeholder-gray-400 backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    🔍
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </motion.nav>
  );
};

export default Navbar;
