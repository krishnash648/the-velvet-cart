import { FaEnvelope, FaUser } from 'react-icons/fa';

export default function About() {
  return (
    <div className="bg-night min-h-screen text-white relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blush via-purple-600 to-indigo-700 opacity-30 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-700 via-blush to-pink-400 opacity-20 rounded-full blur-2xl z-0"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl px-10 py-14 max-w-2xl w-full mx-auto mt-24">
          <h1 className="text-5xl font-extrabold mb-6 gradient-text-animated animate-fade-in">About The Velvet Cart</h1>
          <p className="text-xl text-white/80 mb-8 animate-fade-in delay-100">
            The Velvet Cart is your destination for luxury gadgets and premium electronics. We curate the best in tech, blending style and performance for a seamless shopping experience. Enjoy fast delivery, secure payments, and top-notch customer support.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in delay-200">
            <div className="bg-white/10 rounded-xl px-6 py-4 text-lg font-semibold text-white shadow">100% Genuine Products</div>
            <div className="bg-white/10 rounded-xl px-6 py-4 text-lg font-semibold text-white shadow">Fast Delivery</div>
            <div className="bg-white/10 rounded-xl px-6 py-4 text-lg font-semibold text-white shadow">Easy Returns</div>
            <div className="bg-white/10 rounded-xl px-6 py-4 text-lg font-semibold text-white shadow">Secure Payments</div>
          </div>
          <div className="my-10 flex flex-col items-center gap-4 animate-fade-in delay-300">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blush via-purple-500 to-indigo-600 p-1 shadow-xl flex items-center justify-center mb-2">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&facepad=2" alt="Krishna Sharma" className="w-full h-full object-cover rounded-full border-4 border-white/20" />
            </div>
            <div className="flex items-center gap-2 text-lg text-white/90 font-semibold">
              <FaUser className="text-blush" /> Krishna Sharma <span className="text-xs bg-white/10 rounded px-2 py-1 ml-2">Founder</span>
            </div>
            <a href="mailto:sharmakrishna1605@gmail.com" className="flex items-center gap-2 text-blush font-semibold text-lg hover:underline transition">
              <FaEnvelope /> sharmakrishna1605@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 