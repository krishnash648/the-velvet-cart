import productsData from '../data/products';
import ProductCard from '../components/ProductCard';

const categories = Array.from(new Set(productsData.map(p => p.category)));

export default function Categories() {
  return (
    <div className="bg-night min-h-screen text-white">
      <div className="max-w-7xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Categories</h1>
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 gradient-text">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {productsData.filter(p => p.category === category).map(product => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 