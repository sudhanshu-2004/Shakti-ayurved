import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShoppingCart, Check, ChevronRight, Tag, Plus, Minus } from 'lucide-react';

export default function ComboDetail() {
  const { slug } = useParams();
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('combos').select('*').eq('slug', slug).eq('is_active', true).maybeSingle()
      .then(({ data }) => { if (!data) navigate('/combos'); else setCombo(data); setLoading(false); });
  }, [slug, navigate]);

  if (loading) return <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#1A4D2E] border-t-transparent rounded-full animate-spin" /></div>;
  if (!combo) return null;

  const discountPct = combo.offer_price ? Math.round(((combo.price - combo.offer_price) / combo.price) * 100) : 0;
  const savings = combo.offer_price ? combo.price - combo.offer_price : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(combo, 'combo');
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-6">
          <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
          <ChevronRight size={14} />
          <Link to="/combos" className="hover:text-[#1A4D2E]">Combos</Link>
          <ChevronRight size={14} />
          <span className="text-[#1A4D2E] font-medium">{combo.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm aspect-square">
              <img src={combo.image_url} alt={combo.name} className="w-full h-full object-cover" />
            </div>
            {discountPct > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow">
                {discountPct}% OFF
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Tag size={10} /> COMBO PACK
              </span>
              {combo.is_featured && <span className="bg-[#1A4D2E]/10 text-[#1A4D2E] text-xs font-semibold px-3 py-1 rounded-full">BESTSELLER</span>}
              }
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#1A4D2E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {combo.name}
            </h1>

            <div className="flex items-end gap-3 mb-4">
              <span className="text-3xl font-bold text-[#1A4D2E]">₹{(combo.offer_price || combo.price).toLocaleString()}</span>
              {combo.offer_price && (
                <>
                  <span className="text-lg text-[#2C3E30]/50 line-through">₹{combo.price.toLocaleString()}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-0.5 rounded-full">Save ₹{savings.toLocaleString()}</span>
                </>
              )}
            </div>

            <p className="text-[#2C3E30] text-sm leading-relaxed mb-5">{combo.description}</p>

            <div className="bg-[#F9F7F2] rounded-xl p-4 mb-5">
              <p className="text-sm font-semibold text-[#1A4D2E] mb-2">What's Included:</p>
              <ul className="space-y-1.5">
                {['Premium Herbal Capsules', 'Detailed Usage Guide', 'Free Ayurvedic Diet Plan'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#2C3E30]">
                    <Check size={14} className="text-green-600 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center border border-[#E8E4D9] rounded-full overflow-hidden bg-white">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-[#F9F7F2]">
                  <Minus size={14} />
                </button>
                <span className="px-4 font-semibold text-[#1A4D2E] min-w-[2rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 hover:bg-[#F9F7F2]">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 border-2 border-[#1A4D2E] text-[#1A4D2E] hover:bg-[#1A4D2E] hover:text-white rounded-full h-12 font-semibold"
              >
                <ShoppingCart size={18} className="mr-2" /> Add to Cart
              </Button>
              <Button
                onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                className="flex-1 bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] rounded-full h-12 font-bold"
              >
                Buy Now
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {['100% Herbal Formula', 'Free Delivery', 'Cash on Delivery', 'Money Back Guarantee'].map(tag => (
                <div key={tag} className="flex items-center gap-2 text-xs text-[#2C3E30]">
                  <Check size={13} className="text-green-600 flex-shrink-0" /> {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
