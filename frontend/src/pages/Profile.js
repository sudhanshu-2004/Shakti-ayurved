import { useState, useEffect } from 'react';
import { Link, useNavigate, Routes, Route, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { User, Package, Heart, ChevronRight, CreditCard as Edit2, Save, X, Trash2 } from 'lucide-react';
import { getPriceInfo } from '@/lib/utils';

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login', { state: { from: '/profile' } });
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#1A4D2E] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return null;

  const tabs = [
    { label: 'My Profile', to: '/profile', icon: User },
    { label: 'My Orders', to: '/profile/orders', icon: Package },
    { label: 'Wishlist', to: '/profile/wishlist', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-white border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <h1 className="text-2xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Account</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/profile'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'bg-[#1A4D2E] text-white' : 'bg-white text-[#2C3E30] border border-[#E8E4D9] hover:border-[#1A4D2E]'
                }`
              }
            >
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </div>

        <Routes>
          <Route index element={<ProfileInfo />} />
          <Route path="orders" element={<Orders />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Routes>
      </div>
    </div>
  );
}

function ProfileInfo() {
  const { user, profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '' });
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm max-w-lg">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-[#1A4D2E] text-lg">Profile Information</h2>
        {!editing ? (
          <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="border-[#1A4D2E] text-[#1A4D2E] h-8 text-xs rounded-full">
            <Edit2 size={12} className="mr-1" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#1A4D2E] text-white h-8 text-xs rounded-full">
              <Save size={12} className="mr-1" /> Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="h-8 text-xs rounded-full">
              <X size={12} />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#2C3E30]/60 mb-1">Email</label>
          <p className="text-[#2C3E30] text-sm">{user?.email}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#2C3E30]/60 mb-1">Full Name</label>
          {editing ? (
            <Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className="h-9 text-sm border-[#E8E4D9]" />
          ) : (
            <p className="text-[#2C3E30] text-sm">{profile?.full_name || '—'}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-[#2C3E30]/60 mb-1">Phone</label>
          {editing ? (
            <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-9 text-sm border-[#E8E4D9]" />
          ) : (
            <p className="text-[#2C3E30] text-sm">{profile?.phone || '—'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false); });
  }, []);

  const STATUS_COLOR = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1A4D2E] border-t-transparent rounded-full animate-spin" /></div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package size={48} className="text-[#D4AF37] mx-auto mb-4" />
        <h3 className="font-semibold text-[#1A4D2E] text-lg">No orders yet</h3>
        <p className="text-[#2C3E30]/60 text-sm mt-1">Start shopping to see your orders here</p>
        <Button asChild className="mt-4 bg-[#1A4D2E] text-white rounded-full">
          <Link to="/products">Shop Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-bold text-[#1A4D2E] text-sm">{order.order_number}</p>
              <p className="text-xs text-[#2C3E30]/60 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
              <span className="font-bold text-[#1A4D2E] text-sm">₹{order.total?.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-xs text-[#2C3E30]/60">
            {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''} · {order.payment_method === 'cod' ? 'Cash on Delivery' : 'UPI'}
          </div>
        </div>
      ))}
    </div>
  );
}

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('wishlists').select('*, products(*)').order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  const removeFromWishlist = async (id) => {
    await supabase.from('wishlists').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Removed from wishlist');
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1A4D2E] border-t-transparent rounded-full animate-spin" /></div>;

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart size={48} className="text-[#D4AF37] mx-auto mb-4" />
        <h3 className="font-semibold text-[#1A4D2E] text-lg">Wishlist is empty</h3>
        <p className="text-[#2C3E30]/60 text-sm mt-1">Save products you love</p>
        <Button asChild className="mt-4 bg-[#1A4D2E] text-white rounded-full">
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm group">
          <div className="relative aspect-square bg-[#F9F7F2] cursor-pointer" onClick={() => navigate(`/products/${item.products?.slug}`)}>
            <img src={item.products?.images?.[0]} alt={item.products?.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform" />
            <button
              onClick={e => { e.stopPropagation(); removeFromWishlist(item.id); }}
              className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={12} className="text-red-500" />
            </button>
          </div>
          <div className="p-3">
            <p className="text-xs font-semibold text-[#1A4D2E] line-clamp-2">{item.products?.name}</p>
            <p className="text-xs font-bold text-[#1A4D2E] mt-1">₹{(getPriceInfo(item.products || {}).price).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
