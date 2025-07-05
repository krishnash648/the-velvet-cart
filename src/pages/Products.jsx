import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import productsData from '../data/products';
import ProductCard from '../components/ProductCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Products() {
  const query = useQuery();
  const search = query.get('search') || '';
  const filteredProducts = useMemo(() => {
    if (!search) return productsData;
    return productsData.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Recommendations logic
  const recommendations = useMemo(() => {
    if (!search || filteredProducts.length === 0) return [];
    const shownIds = new Set(filteredProducts.map(p => p.id));
    const categories = new Set(filteredProducts.map(p => p.category));
    const brands = new Set(filteredProducts.map(p => p.brand));
    const recs = productsData.filter(p =>
      !shownIds.has(p.id) && (categories.has(p.category) || brands.has(p.brand))
    );
    return recs.slice(0, 4);
  }, [search, filteredProducts]);

  return (
    <div className="bg-night min-h-screen text-white">
      <div className="max-w-7xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-8 gradient-text">All Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} viewMode="grid" />
            ))
          ) : (
            <div className="col-span-full text-center text-xl text-white/70 py-20">No products found.</div>
          )}
        </div>
        {search && filteredProducts.length > 0 && recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Recommended for you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recommendations.map(product => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 