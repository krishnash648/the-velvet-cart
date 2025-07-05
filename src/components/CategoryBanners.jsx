import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Audio',
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=600&q=80',
    link: '/?category=Audio',
  },
  {
    name: 'Wearables',
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80',
    link: '/?category=Wearables',
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    link: '/?category=Accessories',
  },
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    link: '/?category=Electronics',
  },
];

const CategoryBanners = () => (
  <div className="max-w-7xl mx-auto px-4 mt-8 mb-16">
    <h2 className="text-2xl md:text-3xl font-extrabold mb-8 gradient-text text-center">Shop by Category</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {categories.map((cat) => (
        <Link
          to={cat.link}
          key={cat.name}
          className="group relative rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-500"
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start">
            <span className="text-white text-2xl font-bold drop-shadow-lg mb-2">{cat.name}</span>
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">Shop</span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default CategoryBanners; 