import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { getPriceInfo } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Star, ShoppingCart, Heart, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = [
  { label: 'All Products', value: '' },
  { label: 'Kidney Care', value: 'kidney-care' },
  { label: 'Ear Care', value: 'ear-care' },
  { label: 'Digestive Care', value: 'digestive-care' },
  { label: 'Brain Care', value: 'brain-care' },
  { label: 'Hair Care', value: 'hair-care' },
  { label: 'Weight Management', value: 'weight-management' },
  { label: 'Heart Care', value: 'heart-care' },
  { label: 'Liver Care', value: 'liver-care' },
  { label: 'Blood Pressure Care', value: 'blood-pressure-care' },
  { label: 'Blood Sugar Care', value: 'blood-sugar-care' },
  { label: 'Joint Care', value: 'joint-care' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || searchParams.get('cat') || '');
  const [sortBy, setSortBy] = useState('featured');
  const { addItem } = useCart();
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (!supabase) { setProducts([]); setLoading(false); return; }
      let query = supabase
        .from('products')
        .select('*, categories(name,slug)')
        .eq('is_active', true);

      if (selectedCategory) {
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', selectedCategory)
          .single();

        if (catError || !catData) {
          setProducts([]);
          setLoading(false);
          return;
        }
        query = query.eq('category_id', catData.id);
      }

      if (sortBy === 'price-asc') query = query.order('price', { ascending: true });
      else if (sortBy === 'price-desc') query = query.order('price', { ascending: false });
      else if (sortBy === 'featured') query = query.order('is_featured', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredProducts = products.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.name_hindi && p.name_hindi.includes(searchQuery)) ||
    (p.short_description && p.short_description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchQuery) prev.set('q', searchQuery);
      else prev.delete('q');
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-white border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-2">
            <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#1A4D2E] font-medium">All Products</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Our Products
          </h1>
          <p className="text-[#2C3E30]/70 mt-1">Pure Ayurvedic formulations for natural healing</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9 h-10 bg-white border-[#E8E4D9]"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C3E30]/50" />
            </div>
            {searchQuery && (
              <button type="button" onClick={() => { setSearchQuery(''); setSearchParams({}); }} className="p-2 text-[#2C3E30]/60 hover:text-[#1A4D2E]">
                <X size={16} />
              </button>
            )}
          </form>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="h-10 px-3 rounded-lg border border-[#E8E4D9] bg-white text-sm text-[#2C3E30] focus:outline-none focus:border-[#1A4D2E]"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setSearchParams(prev => {
                  if (cat.value) prev.set('cat', cat.value);
                  else prev.delete('cat');
                  return prev;
                });
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                selectedCategory === cat.value
                  ? 'bg-[#1A4D2E] text-white border-[#1A4D2E]'
                  : 'bg-white text-[#2C3E30] border-[#E8E4D9] hover:border-[#1A4D2E] hover:text-[#1A4D2E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-[#2C3E30]/60 mb-5">
          {loading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
          {(searchQuery || selectedCategory) && (
            <button onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSearchParams({}); }} className="ml-2 text-[#1A4D2E] underline">Clear filters</button>
          )}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-[#E8E4D9]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#E8E4D9] rounded w-3/4" />
                  <div className="h-3 bg-[#E8E4D9] rounded w-1/2" />
                  <div className="h-5 bg-[#E8E4D9] rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#E8E4D9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-[#2C3E30]/40" />
            </div>
            <p className="text-[#1A4D2E] font-semibold text-lg">No products found</p>
            <p className="text-[#2C3E30]/60 mt-1 text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={() => addItem(product)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { price: displayPrice, original_price: originalPrice, showOriginal, discountPct } = getPriceInfo(product);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error('Please login to add to wishlist'); return; }
    if (!supabase) { toast.error('Service unavailable'); return; }
    const { error } = await supabase.from('wishlists').insert({ product_id: product.id });
    if (error && error.code === '23505') {
      toast.info('Already in wishlist');
    } else if (error) {
      toast.error('Failed to add to wishlist');
    } else {
      toast.success('Added to wishlist!');
    }
  };

  const imgSrc = product.images?.[0]
    ? (product.images[0].startsWith('/') ? encodeURI(product.images[0]) : encodeURI(`/images/${product.images[0]}`))
    : '';

  return (
    <Card className="group bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
      <div
        className="relative aspect-square overflow-hidden bg-[#F9F7F2] cursor-pointer"
        onClick={() => navigate(`/products/${product.slug}`)}
      >
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
        />
        {discountPct > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discountPct}%
          </span>
        )}
        <span className="absolute top-2 right-10 bg-[#D4AF37] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded-full">BESTSELLER</span>
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
        >
          <Heart size={13} className="text-[#1A4D2E]" />
        </button>
      </div>
      <CardContent className="p-4">
        <h3
          className="font-semibold text-[#1A4D2E] text-sm leading-snug line-clamp-2 cursor-pointer hover:text-[#D4AF37] transition-colors mb-1"
          onClick={() => navigate(`/products/${product.slug}`)}
        >
          {product.name}
        </h3>
        {product.name_hindi && (
          <p className="text-xs text-[#D4AF37] mb-2">{product.name_hindi}</p>
        )}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className={i < Math.round(product.rating || 4.5) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200 fill-gray-200'} />
            ))}
          </div>
          <span className="text-[10px] text-[#2C3E30]/60">({product.review_count || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-[#1A4D2E] text-base">₹{displayPrice.toLocaleString()}</span>
            {showOriginal && (
              <span className="text-xs text-[#2C3E30]/50 line-through ml-1.5">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(); toast.success('Added to cart!'); }}
            className="w-8 h-8 rounded-full bg-[#1A4D2E] text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-colors"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}