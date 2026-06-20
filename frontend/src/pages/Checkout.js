import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ChevronRight, Check, Truck, Shield, ShoppingBag } from 'lucide-react';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    address: '', city: '', state: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    const required = ['fullName', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!form[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    if (!user) { toast.error('Please login to place order'); navigate('/login'); return; }

    setLoading(true);
    try {
      const shippingAddress = {
        full_name: form.fullName,
        phone: form.phone,
        address_line1: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          subtotal: total,
          discount: 0,
          shipping,
          total: grandTotal,
          payment_method: paymentMethod,
          shipping_address: shippingAddress,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.type === 'product' ? item.id : null,
        combo_id: item.type === 'combo' ? item.id : null,
        name: item.name,
        image_url: item.image,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw itemsErr;

      clearCart();
      navigate('/order-success', { state: { order, paymentMethod } });
    } catch (err) {
      toast.error('Failed to place order: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag size={48} className="text-[#D4AF37]" />
        <h2 className="text-2xl font-bold text-[#1A4D2E]">Your cart is empty</h2>
        <Button asChild className="bg-[#1A4D2E] text-white rounded-full">
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-white border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-1">
            <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#1A4D2E] font-medium">Checkout</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <form onSubmit={handleOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#1A4D2E] text-lg mb-5 flex items-center gap-2">
                  <Truck size={18} className="text-[#D4AF37]" /> Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Full Name *</label>
                    <Input value={form.fullName} onChange={e => updateForm('fullName', e.target.value)} placeholder="Your full name" required className="border-[#E8E4D9] h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Phone Number *</label>
                    <Input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="Mobile number" required className="border-[#E8E4D9] h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Email (optional)</label>
                    <Input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="your@email.com" className="border-[#E8E4D9] h-11" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Address *</label>
                    <Input value={form.address} onChange={e => updateForm('address', e.target.value)} placeholder="House/Flat No, Street, Locality" required className="border-[#E8E4D9] h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">City *</label>
                    <Input value={form.city} onChange={e => updateForm('city', e.target.value)} placeholder="City" required className="border-[#E8E4D9] h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">State *</label>
                    <Input value={form.state} onChange={e => updateForm('state', e.target.value)} placeholder="State" required className="border-[#E8E4D9] h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Pincode *</label>
                    <Input value={form.pincode} onChange={e => updateForm('pincode', e.target.value)} placeholder="6-digit pincode" required className="border-[#E8E4D9] h-11" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#1A4D2E] text-lg mb-5 flex items-center gap-2">
                  <Shield size={18} className="text-[#D4AF37]" /> Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' },
                    { value: 'upi', label: 'UPI Payment', desc: 'GPay, PhonePe, Paytm', icon: '📱' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === opt.value ? 'border-[#1A4D2E] bg-[#1A4D2E]/5' : 'border-[#E8E4D9] hover:border-[#1A4D2E]/30'
                      }`}
                    >
                      <input type="radio" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} className="mt-1" />
                      <div>
                        <div className="font-semibold text-[#1A4D2E] text-sm">{opt.icon} {opt.label}</div>
                        <div className="text-xs text-[#2C3E30]/60 mt-0.5">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {paymentMethod === 'upi' && (
                  <div className="mt-4 p-4 bg-[#F9F7F2] rounded-xl">
                    <p className="text-sm font-medium text-[#1A4D2E] mb-2">Pay via UPI</p>
                    <p className="text-xs text-[#2C3E30]/70">UPI ID: <span className="font-semibold text-[#1A4D2E]">ayurvedlife@upi</span></p>
                    <p className="text-xs text-[#2C3E30]/70 mt-1">Or scan QR code after placing order. Share screenshot to <span className="text-[#1A4D2E]">+91 9911449683</span></p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="font-bold text-[#1A4D2E] text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.key} className="flex gap-3">
                      <div className="w-12 h-12 bg-[#F9F7F2] rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1A4D2E] line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#2C3E30]/60">Qty: {item.quantity}</p>
                        <p className="text-xs font-bold text-[#1A4D2E]">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E8E4D9] pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2C3E30]/70">Subtotal</span>
                    <span className="font-medium">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2C3E30]/70">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-medium'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-[#E8E4D9] pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-[#1A4D2E]">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white rounded-full h-12 font-bold text-base mt-5"
                >
                  {loading ? 'Placing Order...' : `Place Order · ₹${grandTotal.toLocaleString()}`}
                </Button>

                <div className="mt-4 space-y-1.5">
                  {['Secure Checkout', 'Free Shipping on ₹999+', '100% Money Back'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-[#2C3E30]/60">
                      <Check size={12} className="text-green-600" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
