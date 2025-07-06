import { useLocation } from 'react-router-dom';
import { useMemo, useState, useEffect, Suspense, lazy } from 'react';
import productsData from '../data/products';
import { ProductSkeleton } from '../components/LoadingSpinner';
const ProductCard = lazy(() => import('../components/ProductCard'));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function getUniqueBrands(products) {
  return Array.from(new Set(products.map(p => p.brand)));
}

export default function Products() {
  const query = useQuery();
  const search = query.get('search') || '';

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const brands = useMemo(() => getUniqueBrands(productsData), []);

  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase());
      const matchesMinPrice = minPrice === '' || product.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || product.price <= Number(maxPrice);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesRating = minRating === '' || product.rating >= Number(minRating);
      return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesBrand && matchesRating;
    });
  }, [search, minPrice, maxPrice, selectedBrands, minRating]);

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

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setMinRating('');
  };

  const activeFiltersCount = [minPrice, maxPrice, selectedBrands.length, minRating].filter(Boolean).length;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice, selectedBrands, minRating]);

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'w-full' : 'w-64 hidden md:block'} bg-card rounded-2xl p-6 border border-card theme-transition h-fit sticky top-28`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-semibold text-text">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="space-y-8">
        <div className="bg-bg/50 rounded-xl p-4 border border-card/20">
          <div className="font-semibold mb-4 text-text flex items-center gap-2">
            <span>💰</span>
            Price Range
          </div>
          <div className="space-y-3">
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <label className="text-xs text-muted mb-1 block">Min Price</label>
                <input 
                  type="number" 
                  min="0" 
                  placeholder="₹0" 
                  value={minPrice} 
                  onChange={e => setMinPrice(e.target.value)} 
                  className="w-full px-3 py-2 rounded-lg border border-primary focus:ring-2 focus:ring-primary text-sm placeholder-text/50 appearance-none"
                  style={{
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-text)',
                    transition: 'background 0.3s, color 0.3s',
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted mb-1 block">Max Price</label>
                <input 
                  type="number" 
                  min="0" 
                  placeholder="₹50,000" 
                  value={maxPrice} 
                  onChange={e => setMaxPrice(e.target.value)} 
                  className="w-full px-3 py-2 rounded-lg border border-primary focus:ring-2 focus:ring-primary text-sm placeholder-text/50 appearance-none"
                  style={{
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-text)',
                    transition: 'background 0.3s, color 0.3s',
                  }}
                />
              </div>
            </div>
            <div className="text-xs text-muted text-center">
              {minPrice && maxPrice ? `₹${minPrice} - ₹${maxPrice}` : 'Set price range'}
            </div>
          </div>
        </div>
        
        <div className="bg-bg/50 rounded-xl p-4 border border-card/20">
          <div className="font-semibold mb-4 text-text flex items-center gap-2">
            <span>🏷️</span>
            Brand Selection
          </div>
          <div className="space-y-3 max-h-32 overflow-y-auto">
            {brands.map(brand => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-card/20 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-text text-sm">{brand}</span>
                {selectedBrands.includes(brand) && (
                  <span className="ml-auto text-primary text-xs">✓</span>
                )}
              </label>
            ))}
          </div>
          {selectedBrands.length > 0 && (
            <div className="mt-3 text-xs text-muted">
              {selectedBrands.length} brand{selectedBrands.length > 1 ? 's' : ''} selected
            </div>
          )}
        </div>
        
        <div className="bg-bg/50 rounded-xl p-4 border border-card/20">
          <div className="font-semibold mb-4 text-text flex items-center gap-2">
            <span style={{ color: '#FFD700' }}>⭐</span>
            Rating Filter
          </div>
          <div className="space-y-3">
            <div className="relative">
              <select 
                value={minRating} 
                onChange={e => setMinRating(e.target.value)} 
                className="w-full px-3 py-2 rounded-lg border border-primary focus:ring-2 focus:ring-primary text-sm appearance-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-card)',
                  color: 'var(--color-text)',
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                  transition: 'background 0.3s, color 0.3s',
                }}
              >
                <option value="" style={{ background: 'var(--color-card)', color: 'var(--color-text)' }}>Any Rating</option>
                <option value="4.5" style={{ background: 'var(--color-card)', color: 'var(--color-text)' }}>4.5+ Stars</option>
                <option value="4" style={{ background: 'var(--color-card)', color: 'var(--color-text)' }}>4+ Stars</option>
                <option value="3.5" style={{ background: 'var(--color-card)', color: 'var(--color-text)' }}>3.5+ Stars</option>
                <option value="3" style={{ background: 'var(--color-card)', color: 'var(--color-text)' }}>3+ Stars</option>
              </select>
            </div>
            {minRating && (
              <div className="text-xs text-muted text-center bg-primary/10 rounded-lg p-2 border border-primary/20">
                <span className="text-primary font-medium">✓</span> Minimum {minRating}+ rating selected
              </div>
            )}
            {!minRating && (
              <div className="text-xs text-muted text-center">
                Select minimum rating
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-bg/50 rounded-xl p-4 border border-card/20">
          <div className="font-semibold mb-4 text-text flex items-center gap-2">
            <span>📊</span>
            Quick Stats
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Total Products:</span>
              <span className="text-text font-medium">{productsData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Filtered:</span>
              <span className="text-text font-medium">{filteredProducts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Brands:</span>
              <span className="text-text font-medium">{brands.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Price Range:</span>
              <span className="text-text font-medium">₹{Math.min(...productsData.map(p => p.price)).toLocaleString()} - ₹{Math.max(...productsData.map(p => p.price)).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {activeFiltersCount > 0 && (
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <div className="font-semibold mb-2 text-primary flex items-center gap-2">
              <span>🔧</span>
              Active Filters
            </div>
            <div className="space-y-2">
              {minPrice && <div className="text-xs text-primary">Min Price: ₹{minPrice}</div>}
              {maxPrice && <div className="text-xs text-primary">Max Price: ₹{maxPrice}</div>}
              {selectedBrands.length > 0 && <div className="text-xs text-primary">Brands: {selectedBrands.join(', ')}</div>}
              {minRating && <div className="text-xs text-primary">Min Rating: {minRating}+</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-bg min-h-screen text-text theme-transition">
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold gradient-text">All Products</h1>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-card border border-card rounded-lg text-text hover:bg-card/80 transition-colors focus-ring"
          >
            🔍 Filters
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex gap-8">
          <FilterSidebar />
          
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              ) : filteredProducts.length > 0 ? (
                <Suspense fallback={<ProductSkeleton />}>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} viewMode="grid" />
                  ))}
                </Suspense>
              ) : (
                <div className="col-span-full text-center text-xl text-muted py-20">
                  No products found.
                </div>
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
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-overlay"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-card border-l border-card theme-transition">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-muted hover:text-text transition-colors"
                >
                  ✕
                </button>
              </div>
              <FilterSidebar isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 