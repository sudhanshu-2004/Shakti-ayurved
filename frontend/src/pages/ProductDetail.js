import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getPriceInfo } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShoppingCart, Heart, Check, ChevronRight, Star, Plus, Minus, ArrowLeft, Share2 } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      if (!data) navigate('/products');
      else setProduct(data);
    } catch (err) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    const { error } = await supabase.from('wishlists').insert({ product_id: product.id });
    if (error?.code === '23505') toast.info('Already in wishlist');
    else if (error) toast.error('Failed');
    else toast.success('Added to wishlist!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-10 animate-pulse">
            <div className="aspect-square bg-white rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-[#E8E4D9] rounded w-3/4" />
              <div className="h-4 bg-[#E8E4D9] rounded w-1/2" />
              <div className="h-10 bg-[#E8E4D9] rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const { price: displayPrice, original_price: originalPrice, showOriginal, discountPct, savings } = getPriceInfo(product);

  const imgSrc = product.images?.[0]
    ? (product.images[0].startsWith('/') ? encodeURI(product.images[0]) : encodeURI(`/images/${product.images[0]}`))
    : '';

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-6">
          <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-[#1A4D2E]">Products</Link>
          {product.categories && (
            <>
              <ChevronRight size={14} />
              <Link to={`/products?cat=${product.categories.slug}`} className="hover:text-[#1A4D2E]">{product.categories.name}</Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="text-[#1A4D2E] font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm aspect-square">
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
            {discountPct > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow">
                {discountPct}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.categories && (
              <Link to={`/products?cat=${product.categories.slug}`} className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider hover:underline">
                {product.categories.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A4D2E] mt-2 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {product.name}
            </h1>
            {product.name_hindi && (
              <p className="text-[#D4AF37] text-base mb-3">{product.name_hindi}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(product.rating || 4.5) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-[#2C3E30]/70">{product.rating || '4.5'}/5 ({product.review_count || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-5">
              <span className="text-3xl font-bold text-[#1A4D2E]">₹{displayPrice.toLocaleString()}</span>
              {showOriginal && (
                <>
                  <span className="text-lg text-[#2C3E30]/50 line-through">₹{originalPrice.toLocaleString()}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-0.5 rounded-full">Save ₹{savings.toLocaleString()}</span>
                </>
              )}
            </div>

            <p className="text-[#2C3E30] text-sm leading-relaxed mb-5">{product.short_description}</p>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center border border-[#E8E4D9] rounded-full overflow-hidden bg-white">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-[#F9F7F2] transition-colors">
                  <Minus size={14} />
                </button>
                <span className="px-4 font-semibold text-[#1A4D2E] min-w-[2rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 hover:bg-[#F9F7F2] transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={handleWishlist} className="p-2.5 border border-[#E8E4D9] rounded-full hover:border-red-300 hover:text-red-500 transition-colors">
                <Heart size={18} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 border-2 border-[#1A4D2E] text-[#1A4D2E] hover:bg-[#1A4D2E] hover:text-white rounded-full h-12 font-semibold"
              >
                <ShoppingCart size={18} className="mr-2" /> Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] rounded-full h-12 font-bold"
              >
                Buy Now
              </Button>
            </div>

            {/* Trust Tags */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {['100% Herbal & Natural', 'No Side Effects', 'Free Delivery', '100% Money Back'].map(tag => (
                <div key={tag} className="flex items-center gap-2 text-xs text-[#2C3E30]">
                  <Check size={14} className="text-green-600 flex-shrink-0" />
                  {tag}
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-t border-[#E8E4D9] pt-5">
              <div className="flex gap-4 mb-4 border-b border-[#E8E4D9]">
                {['benefits', 'description', 'dosage', 'ingredients'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-semibold capitalize border-b-2 transition-colors ${
                      activeTab === tab ? 'border-[#D4AF37] text-[#1A4D2E]' : 'border-transparent text-[#2C3E30]/60 hover:text-[#1A4D2E]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'benefits' && product.benefits?.length > 0 && (
                <ul className="space-y-2">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#2C3E30]">
                      <span className="w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={11} className="text-white" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'description' && (
                <p className="text-sm text-[#2C3E30] leading-relaxed">{product.description}</p>
              )}

              {activeTab === 'dosage' && (
                <div className="bg-[#F9F7F2] rounded-xl p-4">
                  <p className="text-sm font-semibold text-[#1A4D2E] mb-1">Recommended Dosage</p>
                  <p className="text-sm text-[#2C3E30]">{product.dosage || 'As directed by physician'}</p>
                </div>
              )}

              {activeTab === 'ingredients' && product.ingredients?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="bg-[#F9F7F2] border border-[#E8E4D9] text-[#2C3E30] text-xs px-3 py-1 rounded-full">
                      {ing}
                    </span>
                  ))}
                </div>
              )}

              {activeTab === 'ingredients' && (!product.ingredients || product.ingredients.length === 0) && (
                <p className="text-sm text-[#2C3E30]/60">Ingredients list coming soon.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
