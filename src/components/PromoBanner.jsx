import { Link } from 'react-router-dom';

const PromoBanner = () => (
  <div className="max-w-5xl mx-auto my-12 rounded-3xl shadow-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
    <div className="text-white text-2xl md:text-3xl font-extrabold mb-2 md:mb-0 drop-shadow-lg">
      Summer Sale! <span className="font-bold text-yellow-300">Up to 40% off</span> select gadgets.
    </div>
    <Link to="/" className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl shadow-lg text-lg transition-all duration-300">
      Shop Now
    </Link>
  </div>
);

export default PromoBanner; 