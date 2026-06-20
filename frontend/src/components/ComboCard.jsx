import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export function ComboCard({ combo, onAddToCart }) {
  const navigate = useNavigate();
  const discountPct = combo.offer_price
    ? Math.round(((combo.price - combo.offer_price) / combo.price) * 100)
    : 0;
  const savings = combo.offer_price ? combo.price - combo.offer_price : 0;

  return (
    <div className="group bg-gradient-to-br from-[#1A4D2E] to-[#0F2F1C] border border-[#2D6B45] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl flex flex-col cursor-pointer" onClick={() => navigate(`/combos/${combo.slug}`)}>
      <div className="relative aspect-square overflow-hidden bg-[#0F2F1C]/50">
        <img src={combo.image_url} alt={combo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85" />
        {discountPct > 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{discountPct}%</span>}
        <span className="absolute top-2 right-2 bg-[#D4AF37] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded-full">COMBO</span>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-white text-xs md:text-sm leading-snug line-clamp-2 mb-1 flex-1">{combo.name}</h3>
        <p className="text-white/60 text-[10px] line-clamp-2 mb-1.5 leading-relaxed">{combo.description}</p>
        {savings > 0 && <p className="text-[#D4AF37] text-[10px] font-semibold mb-2">Save ₹{savings.toLocaleString()}</p>}
        <div className="mb-2">
          <span className="font-bold text-[#D4AF37] text-sm">₹{(combo.offer_price || combo.price).toLocaleString()}</span>
          {combo.offer_price && <span className="text-[10px] text-white/40 line-through ml-1">MRP ₹{combo.price.toLocaleString()}</span>}
        </div>
        <div className="flex gap-1.5">
          <button onClick={e => { e.stopPropagation(); onAddToCart(); }}
            className="flex-1 flex items-center justify-center gap-1 bg-white/15 hover:bg-white/25 text-white text-[10px] font-semibold py-2 rounded-lg transition-colors border border-white/20">
            <ShoppingCart size={11} /> Add to Cart
          </button>
          <button onClick={() => navigate(`/combos/${combo.slug}`)}
            className="flex-1 flex items-center justify-center gap-1 bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] text-[10px] font-bold py-2 rounded-lg transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export function ComboCardDark({ combo, onAddToCart }) {
  const navigate = useNavigate();
  const discountPct = combo.offer_price
    ? Math.round(((combo.price - combo.offer_price) / combo.price) * 100)
    : 0;
  const savings = combo.offer_price ? combo.price - combo.offer_price : 0;

  return (
    <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl overflow-hidden transition-all group">
      <div className="flex items-stretch">
        <div className="w-24 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/combos/${combo.slug}`)}>
          <img src={combo.image_url} alt={combo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-white text-sm leading-snug cursor-pointer" onClick={() => navigate(`/combos/${combo.slug}`)}>{combo.name}</h3>
              {discountPct > 0 && <span className="bg-red-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">-{discountPct}%</span>}
            </div>
            {savings > 0 && <p className="text-[#D4AF37] text-xs font-medium mb-1">Save ₹{savings.toLocaleString()}</p>}
            <div className="mb-3">
              <span className="font-bold text-[#D4AF37] text-base">₹{(combo.offer_price || combo.price).toLocaleString()}</span>
              {combo.offer_price && <span className="text-xs text-white/40 line-through ml-1.5">₹{combo.price.toLocaleString()}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={e => { e.stopPropagation(); onAddToCart(); }}
              className="flex-1 flex items-center justify-center gap-1 border border-white/30 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <ShoppingCart size={12} /> Add
            </button>
            <button onClick={() => navigate(`/combos/${combo.slug}`)}
              className="flex-1 bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] text-xs font-bold py-1.5 rounded-lg transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
