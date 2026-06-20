import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, count, total, isOpen, setIsOpen, removeItem, updateQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4D9]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#1A4D2E]" />
            <h2 className="font-bold text-lg text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              My Cart
            </h2>
            {count > 0 && (
              <span className="bg-[#D4AF37] text-[#1A1A1A] text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 text-[#2C3E30] hover:text-[#1A4D2E]">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 bg-[#F9F7F2] rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#1A4D2E]">Your cart is empty</p>
                <p className="text-sm text-[#2C3E30]/60 mt-1">Add products to get started</p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white rounded-full"
                asChild
              >
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.key} className="flex gap-3 p-3 bg-[#F9F7F2] rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A4D2E] line-clamp-2 leading-snug">{item.name}</p>
                    {item.type === 'combo' && (
                      <span className="text-[10px] bg-[#D4AF37] text-[#1A1A1A] px-1.5 py-0.5 rounded-full font-semibold">COMBO</span>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#1A4D2E] font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white border border-[#E8E4D9] flex items-center justify-center hover:border-[#1A4D2E]"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-[#1A4D2E] text-white flex items-center justify-center hover:bg-[#0F2F1C]"
                        >
                          <Plus size={10} />
                        </button>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 ml-1"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E8E4D9] px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#2C3E30]/70">Subtotal</span>
              <span className="font-bold text-[#1A4D2E]">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#2C3E30]/70">Shipping</span>
              <span className="text-green-600 font-semibold">{total >= 999 ? 'FREE' : '₹99'}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-[#E8E4D9] pt-3">
              <span>Total</span>
              <span className="text-[#1A4D2E]">₹{(total + (total >= 999 ? 0 : 99)).toLocaleString()}</span>
            </div>
            {total < 999 && (
              <p className="text-xs text-center text-[#D4AF37] font-medium">
                Add ₹{(999 - total).toLocaleString()} more for FREE shipping!
              </p>
            )}
            <Button
              className="w-full bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white rounded-full h-12 font-semibold text-base"
              asChild
              onClick={() => setIsOpen(false)}
            >
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#1A4D2E] text-[#1A4D2E] rounded-full h-10 text-sm"
              onClick={() => setIsOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
