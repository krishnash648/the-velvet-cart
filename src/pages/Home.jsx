import { useState, useMemo } from 'react';
import productsData from '../data/products';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import FeaturedProductsCarousel from '../components/FeaturedProductsCarousel';
import TrustBadgesRow from '../components/TrustBadgesRow';
import RecentlyViewed from '../components/RecentlyViewed';
import ProductComparison from '../components/ProductComparison';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Audio', 'Wearables', 'Accessories', 'Electronics'];
const brands = ['All', 'Sony', 'Apple', 'JBL', 'Logitech', 'Samsung', 'Corsair', 'GoPro'];
const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'newest', label: 'Newest First' }
];

export default function Home() {
  const { user, getRecommendations } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const allPrices = productsData.map(p => p.price);
  const minProductPrice = Math.min(...allPrices);
  const maxProductPrice = Math.max(...allPrices);

  const [minPrice, setMinPrice] = useState(minProductPrice);
  const [maxPrice, setMaxPrice] = useState(maxProductPrice);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productsData.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy]);

  const liveResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return productsData.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6);
  }, [searchTerm]);

  const recommendations = getRecommendations ? getRecommendations() : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div className="p-0 bg-bg min-h-screen text-text theme-transition">
      <style>{`
        ::-webkit-scrollbar { width: 8px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--color-primary); border-radius: 8px; }
        .sidebar-glass { background: rgba(40, 20, 60, 0.45); box-shadow: 0 4px 32px 0 var(--color-primary), 0 1.5px 8px 0 rgba(255,255,255,0.1); border: 1.5px solid var(--color-primary); border-left: none; border-top-left-radius: 0; border-bottom-left-radius: 0; border-top-right-radius: 1.5rem; border-bottom-right-radius: 1.5rem; backdrop-filter: blur(18px); min-width: 250px; max-width: 270px; margin-left: 0; position: relative; left: 0; }
        .sidebar-btn { transition: all 0.18s; }
        .sidebar-btn:hover { background: var(--color-primary) !important; color: #fff !important; box-shadow: 0 2px 8px var(--color-primary); }
        .sidebar-btn.active { background: linear-gradient(90deg,var(--color-primary),var(--color-secondary)); color: #fff; box-shadow: 0 2px 12px var(--color-primary); }
        .price-slider::-webkit-slider-thumb { background: var(--color-primary); border: 2px solid #fff; border-radius: 50%; width: 18px; height: 18px; box-shadow: 0 2px 8px var(--color-primary); }
        .recommended-scroll { display: flex; gap: 2rem; overflow-x: auto; padding-bottom: 8px; margin-bottom: 2.5rem; scrollbar-width: thin; }
        .recommended-scroll::-webkit-scrollbar { height: 8px; background: transparent; }
        .recommended-scroll::-webkit-scrollbar-thumb { background: var(--color-primary); border-radius: 8px; }
        .separate-card { background: var(--color-card); border: 2.5px solid var(--color-primary); border-radius: 2.2rem; box-shadow: 0 16px 48px 0 var(--color-primary), 0 4px 16px rgba(255,255,255,0.3); margin: 1.5rem; transition: box-shadow 0.18s, transform 0.18s; min-width: 220px; max-width: 240px; }
        .separate-card:hover { transform: translateY(-18px) scale(1.09); box-shadow: 0 32px 100px var(--color-primary), 0 12px 32px rgba(255,255,255,0.4); z-index: 2; }
      `}</style>
      <section className="relative h-[90vh] w-full overflow-hidden">
        <div className="absolute top-1/3 left-16 w-32 h-40 rounded-xl overflow-hidden opacity-70 blur-xl z-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300&h=400&fit=crop" 
            alt="Blurred left" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-1/2 right-16 w-32 h-28 rounded-xl overflow-hidden opacity-70 blur-xl z-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1518445695201-00a2b6b7c9a7?w=300&h=200&fit=crop" 
            alt="Portable Bluetooth Speaker" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop" 
            alt="Tech background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-overlay"></div>
        </div>
        <div className="absolute inset-0 gradient-bg-animated"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/40 to-black/60"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-4 h-4 bg-secondary rounded-full animate-bounce-slow opacity-60"></div>
          <div className="absolute top-40 right-32 w-6 h-6 bg-primary rounded-full float opacity-40"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-secondary rounded-full animate-pulse-slow opacity-70"></div>
          <div className="absolute top-1/2 right-1/4 w-5 h-5 bg-primary rounded-full float opacity-50"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1 
            className="text-7xl md:text-8xl font-extrabold tracking-wide text-text drop-shadow-lg gradient-text-animated"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            The Velvet Cart
          </motion.h1>
          <motion.p 
            className="text-2xl md:text-3xl mt-6 max-w-2xl text-text/90 glow-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Where tech meets taste. Luxury gadgets, served fresh.
          </motion.p>
          <motion.div 
            className="mt-12 w-full max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search for products, brands, or categories..."
                className="w-full px-8 py-4 bg-card/15 backdrop-blur-xl border border-card/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-text placeholder-text/60 text-lg shadow-2xl glow-hover focus-ring"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl animate-pulse-slow">
                ✨
              </div>
              {searchTerm && liveResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-card/95 rounded-2xl shadow-2xl border border-card/10 z-50 max-h-96 overflow-y-auto">
                  {liveResults.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-card/10 cursor-pointer transition"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-xl" />
                      <div className="flex-1">
                        <div className="font-semibold text-text">{product.name}</div>
                        <div className="text-sm text-muted">₹{product.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {searchTerm && liveResults.length === 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-card/95 rounded-2xl shadow-2xl border border-card/10 z-50 px-4 py-3 text-muted text-center">
                  No products found.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-white/10 w-full max-w-3xl">
          <input
            type="text"
            placeholder="Search products..."
            className="px-3 py-2 rounded-full bg-white/20 border-none text-white w-32 focus:outline-none focus:ring-2 focus:ring-blush text-sm placeholder-white/60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-full bg-white/20 border-none text-white text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-gray-800 bg-white">{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="relative z-30 flex w-full max-w-7xl mx-auto mt-10 gap-0 md:gap-8 items-start">
        <div className="absolute left-0 top-0 bottom-0 w-72 bg-white/10 border-r border-white/20 rounded-none md:rounded-3xl shadow-lg -z-10" style={{ minHeight: '100%' }} />
        <aside className="w-72 min-w-[260px] p-6 flex flex-col h-full relative z-10">
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 gradient-text">Categories</h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg sidebar-btn font-medium${selectedCategory === cat ? ' active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 gradient-text">Brands</h3>
            <ul className="space-y-2">
              {brands.map(brand => (
                <li key={brand}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg sidebar-btn font-medium${selectedBrand === brand ? ' active' : ''}`}
                    onClick={() => setSelectedBrand(brand)}
                  >
                    {brand}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 gradient-text">Price Range</h3>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-white/70">₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}</span>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={minPrice}
                onChange={e => {
                  const value = parseInt(e.target.value);
                  setMinPrice(value > maxPrice ? maxPrice : value);
                }}
                className="accent-blush glow-hover price-slider"
              />
            <input
              type="range"
                min="0"
                max="50000"
                step="1000"
              value={maxPrice}
                onChange={e => {
                  const value = parseInt(e.target.value);
                  setMaxPrice(value < minPrice ? minPrice : value);
                }}
                className="accent-blush glow-hover price-slider"
              />
            </div>
          </div>
        </aside>
        <main className="flex-1 pl-0 md:pl-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 justify-center"
          >
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={containerVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ scale: 1.025, y: -3 }}
                  style={{ minWidth: 280, maxWidth: 280 }}
                >
                  <ProductCard product={product} viewMode={viewMode} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-xl text-white/70 py-20">No products found.</div>
            )}
          </motion.div>
        </main>
      </div>

      <div className="mt-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold gradient-text">Recommended for You</h2>
          <div className="text-xl">✨</div>
        </div>
        <div className="recommended-scroll">
          {user && getRecommendations(productsData, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.025, y: -3 }}
              className=""
              style={{ minWidth: 280, maxWidth: 280 }}
            >
              <ProductCard product={product} viewMode="grid" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full bg-yellow-400 text-white text-center py-3 font-semibold text-lg mb-8">
        Monsoon Sale: Get up to 40% off on select products! Free shipping on orders over ₹999!
      </div>

      <RecentlyViewed />

      <ProductComparison />

      <FeaturedProductsCarousel />

      <TrustBadgesRow />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="my-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">What Our Customers Say</h2>
          <p className="text-xl text-white/80">Real reviews from real customers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blush/50 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden mr-4 shadow-lg glow border-2 border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" 
                  alt="Aisha Patel" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{display: 'none'}}>
                  A
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white">Aisha Patel</h4>
                <div className="flex text-yellow-400 text-sm">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed">
              "The Velvet Cart has the best selection of premium gadgets. Fast delivery and excellent customer service. My new Sony headphones are amazing!"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blush/50 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden mr-4 shadow-lg glow border-2 border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                  alt="Rahul Sharma" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-white">Rahul Sharma</h4>
                <div className="flex text-yellow-400 text-sm">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed">
              "Found exactly what I was looking for! The Apple Watch I ordered arrived in perfect condition. Highly recommend this store!"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blush/50 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden mr-4 shadow-lg glow border-2 border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" 
                  alt="Priya Verma" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-white">Priya Verma</h4>
                <div className="flex text-yellow-400 text-sm">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed">
              "Amazing quality products and competitive prices. The JBL speaker I bought sounds incredible. Will definitely shop here again!"
            </p>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
