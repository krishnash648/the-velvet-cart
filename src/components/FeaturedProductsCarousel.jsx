import { useState, useEffect } from 'react';
import products from '../data/products';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const getFeatured = () => products.slice(0, 6);

const FeaturedProductsCarousel = () => {
  const featured = getFeatured();
  const [current, setCurrent] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // It will Show 3 on desktop & 1 on mobile
  const slidesToShow = windowWidth >= 1024 ? 3 : 1;
  const maxIndex = featured.length - slidesToShow;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const goTo = (idx) => setCurrent(idx);
  const prev = () => setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const next = () => setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-12 mb-20">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-3xl font-extrabold gradient-text">Featured Products</h2>
        <div className="flex gap-2">
          <button onClick={prev} className="p-2 rounded-full bg-white/30 hover:bg-white/50 shadow-lg text-xl">
            &#8592;
          </button>
          <button onClick={next} className="p-2 rounded-full bg-white/30 hover:bg-white/50 shadow-lg text-xl">
            &#8594;
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/40">
        <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${current * (100 / slidesToShow)}%)` }}>
          {featured.map((product, idx) => (
            <motion.div
              key={product.id}
              className="min-w-full lg:min-w-[33.3333%] p-6 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="w-full h-64 flex items-center justify-center mb-4">
                <img src={product.image} alt={product.name} className="object-cover h-full w-full rounded-2xl shadow-xl border-4 border-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center line-clamp-2">{product.name}</h3>
              <div className="text-lg font-semibold gradient-text mb-2">₹{product.price.toLocaleString()}</div>
              <Link to={`/product/${product.id}`} className="mt-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                Shop Now
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${current === idx ? 'bg-pink-500 scale-125 shadow-lg' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel; 
