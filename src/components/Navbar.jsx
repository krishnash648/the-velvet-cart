import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';

const navLinks = [
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/track-order', label: 'Track Order' },
  { to: '/about', label: 'About' },
  { to: '/admin', label: 'Admin' }
];

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout, wishlist } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-navbar backdrop-blur-xl shadow-lg border-b border-card theme-transition"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full pl-6 pr-6">
        <div className="flex items-center justify-between h-20 w-full">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-4 group">
              <motion.div 
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card/10 backdrop-blur-md shadow-lg border border-card/20"
                whileHover={{ rotate: 15, scale: 1.08 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src="/the-velvet-cart/logo.png" 
                  alt="Velvet Cart Logo" 
                  className="w-8 h-8 object-contain"
                />
              </motion.div>
              <span className="text-2xl font-extrabold tracking-wide gradient-text select-none">Velvet Cart</span>
            </Link>
            <div className="h-8 w-px bg-card/20 mx-6" />
          </div>
          <div className="hidden md:flex items-center gap-x-12">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar-link text-base font-semibold text-muted hover:text-text transition-all duration-200 focus-ring ${location.pathname.startsWith(link.to) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden text-muted hover:text-text transition-colors p-2 rounded-lg hover:bg-card/10 focus-ring"
              aria-label="Toggle search"
            >
              🔍
            </button>
            
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-card/10 transition-all duration-300 focus-ring"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <div className="text-2xl">
                {theme === 'dark' ? '☀️' : '🌙'}
              </div>
            </motion.button>
            
            {user && (
              <Link to="/profile?tab=wishlist" className="relative group">
                <motion.div 
                  className="relative p-2 rounded-xl hover:bg-card/10 transition-all duration-300 group-hover:scale-110"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-2xl">❤️</div>
                  <AnimatePresence>
                    {wishlist.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold glow"
                      >
                        {wishlist.length > 99 ? '99+' : wishlist.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )}
            <Link to="/cart" className="relative group">
              <motion.div 
                className="relative p-2 rounded-xl hover:bg-card/10 transition-all duration-300 group-hover:scale-110"
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
            </Link>
            {user ? (
              <div className="relative group">
                <motion.button 
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-card/10 transition-all duration-300 group-hover:scale-105 focus-ring"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blush to-purple-600 rounded-full flex items-center justify-center text-white font-bold glow">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                  <span className="hidden md:block text-sm text-muted">{user.firstName}</span>
                </motion.button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-card/10 backdrop-blur-xl rounded-xl border border-card/20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto shadow-2xl">
                  <div className="p-2">
                    <Link to="/profile" className="block px-3 py-2 text-sm text-muted hover:text-text hover:bg-card/10 rounded-lg transition-all duration-200">
                      Profile
                    </Link>
                    <Link to="/profile" className="block px-3 py-2 text-sm text-muted hover:text-text hover:bg-card/10 rounded-lg transition-all duration-200">
                      Orders ({user.orders?.length || 0})
                    </Link>
                    <button onClick={logout} className="block w-full text-left px-3 py-2 text-sm text-error hover:text-text hover:bg-error/20 rounded-lg transition-all duration-200">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold transition-all duration-200 focus-ring"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {authModalOpen && (
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
