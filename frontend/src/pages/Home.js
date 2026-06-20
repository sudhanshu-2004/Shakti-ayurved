import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getPriceInfo } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ChevronRight, Star, Check, Shield, Leaf, Award, RefreshCw,
  Truck, BadgeCheck, Phone, Clock, MessageCircle, ShoppingCart,
  Heart, Brain, Scissors, Scale, Activity, Droplets, Eye, Bone, Flame, Zap
} from 'lucide-react';
import { ComboCard, ComboCardDark } from '@/components/ComboCard';

const LOGO_URL = "/images/WhatsApp_Image_2026-06-06_at_12.40.22_AM.jpeg";
const PATHRI_IMG = "/images/WhatsApp_Image_2026-06-05_at_10.54.04_PM.jpeg";
const JOINT_IMG = "/images/shakti ayurved_home.jpeg";
const WEIGHT_IMG = "/images/WhatsApp_Image_2026-06-06_at_12.32.39_AM_(2).jpeg";

const CATEGORIES = [
  { name: 'Kidney Care', slug: 'kidney-care', icon: Droplets, color: '#4A90D9' },
  { name: 'Ear Care', slug: 'ear-care', icon: Eye, color: '#7B68EE' },
  { name: 'Digestive Care', slug: 'digestive-care', icon: Activity, color: '#E67E22' },
  { name: 'Brain Care', slug: 'brain-care', icon: Brain, color: '#9B59B6' },
  { name: 'Hair Care', slug: 'hair-care', icon: Scissors, color: '#E91E8C' },
  { name: 'Weight Management', slug: 'weight-management', icon: Scale, color: '#27AE60' },
  { name: 'Heart Care', slug: 'heart-care', icon: Heart, color: '#E74C3C' },
  { name: 'Liver Care', slug: 'liver-care', icon: Flame, color: '#E67E22' },
  { name: 'Blood Pressure Care', slug: 'blood-pressure-care', icon: Activity, color: '#C0392B' },
  { name: 'Blood Sugar Care', slug: 'blood-sugar-care', icon: Droplets, color: '#F39C12' },
  { name: 'Joint Care', slug: 'joint-care', icon: Bone, color: '#1ABC9C' },
];

const PRODUCT_SECTIONS = [
  { category: 'Kidney Stone Care (Pathri)', slug: 'kidney-care', productSlugs: ['pathri-mukti-capsules', 'pathri-mukti-powder', 'pathri-mukti-liquid'], comboSlug: 'pathri-mukti-complete-combo', color: '#4A90D9' },
  { category: 'Ear Care', slug: 'ear-care', productSlugs: ['ear-veda-capsules', 'ear-veda-powder'], comboSlug: 'ear-veda-complete-combo', color: '#7B68EE' },
  { category: 'Digestive Care', slug: 'digestive-care', productSlugs: ['pet-safa'], color: '#E67E22' },
  { category: 'Brain Care', slug: 'brain-care', productSlugs: ['brain-booster'], color: '#9B59B6' },
  { category: 'Hair Care', slug: 'hair-care', productSlugs: ['hair-growth'], color: '#E91E8C' },
  { category: 'Weight Management', slug: 'weight-management', productSlugs: ['weight-loss'], color: '#27AE60' },
  { category: 'Heart Care', slug: 'heart-care', productSlugs: ['heart-care-product'], color: '#E74C3C' },
  { category: 'Liver Care', slug: 'liver-care', comboSlug: 'liver-care-combo', color: '#E67E22' },
  { category: 'Blood Pressure Care', slug: 'blood-pressure-care', comboSlug: 'bp-control-combo', color: '#C0392B' },
  { category: 'Blood Sugar Care', slug: 'blood-sugar-care', comboSlug: 'sugar-control-combo', color: '#F39C12' },
  { category: 'Joint Care', slug: 'joint-care', comboSlug: 'joint-pain-combo', color: '#1ABC9C' },
];

const ALL_COMBOS = [
  'pathri-mukti-complete-combo',
  'ear-veda-complete-combo',
  'liver-care-combo',
  'bp-control-combo',
  'sugar-control-combo',
  'joint-pain-combo',
];

// Local sample data fallback used when Supabase keys are not configured
const SAMPLE_PRODUCTS = [
  {
    id: 'sample-1',
    name: 'Pathri Mukti Capsules',
    name_hindi: 'पथरी मुक्ति',
    slug: 'pathri-mukti-capsules',
    images: [PATHRI_IMG],
    price: 299,
    original_price: 499,
    rating: 4.8,
    review_count: 120,
    short_description: 'Natural ayurvedic formula for kidney stone support.',
    is_featured: true,
    is_active: true,
    categories: [{ name: 'Kidney Care', slug: 'kidney-care' }],
  },
  {
    id: 'sample-2',
    name: 'Pet Safa Powder',
    slug: 'pet-safa',
    images: [WEIGHT_IMG],
    price: 199,
    original_price: 199,
    rating: 4.6,
    review_count: 86,
    short_description: 'Gentle digestive support for adults and children.',
    is_featured: false,
    is_active: true,
    categories: [{ name: 'Digestive Care', slug: 'digestive-care' }],
  },
];

const SAMPLE_COMBOS = [
  {
    id: 'combo-sample-1',
    name: 'Pathri Mukti Complete Combo',
    slug: 'pathri-mukti-complete-combo',
    images: [PATHRI_IMG],
    image_url: PATHRI_IMG,
    price: 799,
    offer_price: 749,
    original_price: 999,
    description: 'Complete kidney support pack',
    is_active: true,
  },
];

const TRUST_BADGES = [
  { icon: Truck, title: 'Free Delivery', sub: 'All Over India' },
  { icon: RefreshCw, title: '100% Return', sub: 'Full Refund Policy' },
  { icon: Phone, title: 'Doctor Callback', sub: 'Free Consultation' },
  { icon: BadgeCheck, title: 'Cash on Delivery', sub: 'Pay at Door' },
];

const REVIEWS = [
  { id: 1, name: 'Rajesh Kumar', location: 'Delhi', rating: 5, text: 'Used Pathri Mukti Capsules for 2 months. Kidney stone dissolved completely! Amazing product by Shakti Ayurved.', product: 'Pathri Mukti Capsules' },
  { id: 2, name: 'Pooja Sharma', location: 'Mumbai', rating: 5, text: 'Pet Safa is a life saver! I had chronic constipation for years. Within a week I saw dramatic improvement.', product: 'Pet Safa' },
  { id: 3, name: 'Anil Verma', location: 'Jaipur', rating: 5, text: 'My joint pain reduced by 80% after using Joint Pain Combo for a month. Totally natural and no side effects!', product: 'Joint Pain Combo' },
  { id: 4, name: 'Sunita Devi', location: 'Lucknow', rating: 5, text: 'Sugar Control Combo has been helping me manage my diabetes naturally along with my prescribed medication.', product: 'Sugar Control Combo' },
  { id: 5, name: 'Vikram Singh', location: 'Chandigarh', rating: 5, text: 'BP Control Combo is excellent! My blood pressure is much more stable now. Highly recommend to everyone.', product: 'BP Control Combo' },
  { id: 6, name: 'Meena Gupta', location: 'Pune', rating: 5, text: 'Liver Care Combo is remarkable. My liver enzymes improved significantly within 6 weeks of regular use.', product: 'Liver Care Combo' },
];

const FAQ_DATA = [
  { q: 'Are SHAKTI AYURVED products 100% natural?', a: 'Yes, all our products are made from 100% natural Ayurvedic herbs. We do not use any synthetic chemicals, artificial preservatives, or harmful additives.' },
  { q: 'How long before I see results?', a: 'Most customers notice improvements within 15-30 days of regular use. For chronic conditions, 2-3 months of consistent use is recommended for best results.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes! We offer Cash on Delivery across India. You can also pay via UPI for a seamless experience.' },
  { q: 'Can I take multiple products together?', a: 'Yes, most of our products are safe to combine. However, we recommend consulting our experts via WhatsApp for personalized advice.' },
  { q: 'What is your return policy?', a: 'We offer a 100% satisfaction guarantee. If not satisfied, you can return within 30 days for a full refund — no questions asked.' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [consultForm, setConsultForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      if (!supabase) {
        // Use local sample data for development when Supabase keys are not set
        setProducts(SAMPLE_PRODUCTS);
        setCombos(SAMPLE_COMBOS);
        return;
      }

      const [prodRes, comboRes] = await Promise.all([
        supabase.from('products').select('*, categories(name, slug)').eq('is_active', true),
        supabase.from('combos').select('*').eq('is_active', true),
      ]);
      setProducts(prodRes.data || []);
      setCombos(comboRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // ComboCard and ComboCardDark moved to frontend/src/components/ComboCard.jsx
  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    if (!consultForm.name && !consultForm.phone) {
      toast.error('Please enter name and phone');
      return;
    }
    setSubmitting(true);
    try {
      // Optionally persist to backend or Supabase here
      toast.success('Thank you — our expert will call you soon!');
      setConsultForm({ name: '', phone: '' });
    } catch (err) {
      console.error('consult submit error', err);
      toast.error('Submission failed — please try again');
    } finally {
      setSubmitting(false);
    }
  };
  

  // Normalize combos for display (use `image_url` and `description` fallbacks)
  const allCombosData = (combos || []).map(c => ({
    ...c,
    image_url: c.image_url || (Array.isArray(c.images) ? c.images[0] : c.image || ''),
    description: c.description || c.short_description || '',
  })).filter(Boolean);
  return (
    <div>
     {/* HERO: cream banner with herbs image, slider style */}
      <section className="relative bg-[#F5F1E8] overflow-hidden">
        <div className="absolute inset-0">
          <img src={JOINT_IMG} alt="Ayurvedic herbs" className="w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1E8] via-[#F5F1E8]/95 to-[#F5F1E8]/40 md:to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center relative">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A4D2E] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Natural Healing,<br />Pure Ayurveda
              </h1>
              <p className="text-[#2C3E30]/70 mt-4 max-w-md leading-relaxed">
                Ancient wisdom. Modern wellness. 100% Natural Ayurvedic Products for you and your family.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Link to="/products" className="inline-flex items-center gap-2 bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white font-semibold px-6 py-3 rounded-full">Shop Now</Link>
                <Link to="/products" className="inline-flex items-center gap-2 border-2 border-[#D4AF37] bg-white/90 md:bg-white/50 text-[#1A4D2E] font-semibold px-6 py-3 rounded-full hover:bg-white">View All Products</Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-[#1A4D2E] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1A4D2E]">100% Natural</p>
                    <p className="text-[10px] text-[#2C3E30]/60">Pure & Safe</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-[#1A4D2E] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1A4D2E]">Ayurvedic Experts</p>
                    <p className="text-[10px] text-[#2C3E30]/60">Trusted Guidance</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={20} className="text-[#1A4D2E] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1A4D2E]">100% Return</p>
                    <p className="text-[10px] text-[#2C3E30]/60">Easy Refund</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={20} className="text-[#1A4D2E] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1A4D2E]">Fast Delivery</p>
                    <p className="text-[10px] text-[#2C3E30]/60">On All Orders</p>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </section>
      {loading ? (
        <section className="py-12 bg-[#F9F7F2]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-[#E8E4D9]" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-[#E8E4D9] rounded w-3/4" />
                    <div className="h-3 bg-[#E8E4D9] rounded w-1/2" />
                    <div className="h-8 bg-[#E8E4D9] rounded w-full mt-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          {/*
            New Section: All Products
            - Reuses existing `products` fetched in `loadData()`.
            - Displays every product with the existing `ProductCard` and grid styling.
            - Placed immediately before the category sections (PRODUCT_SECTIONS) as requested.
          */}
          <section key="all-products" className="py-12 border-b border-[#E8E4D9] bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-9 rounded-full" style={{ backgroundColor: '#1A4D2E' }} />
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>All Products</h2>
                    <p className="text-xs text-[#2C3E30]/55 mt-0.5">Browse our complete catalog — updated in real-time</p>
                  </div>
                </div>
                <Link to="/products" className="text-xs font-semibold text-[#1A4D2E] hover:text-[#D4AF37] transition-colors flex items-center gap-1 border border-[#E8E4D9] hover:border-[#D4AF37] px-3 py-1.5 rounded-full">
                  View All <ChevronRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => { addItem(product); toast.success('Added to cart!'); }}
                  />
                ))}
              </div>
            </div>
          </section>

          
        </>
      )}

      {/* ── COMBO OFFERS ── */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1A4D2E] to-[#0F2F1C]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <div className="w-14 h-0.5 bg-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Combo Offers</h2>
            <p className="text-white/70 mt-2">Complete health solutions — save more with value packs</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-white/10 rounded-2xl h-32 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allCombosData.map(combo => (
                <ComboCardDark key={combo.id} combo={combo} onAddToCart={() => { addItem(combo, 'combo'); toast.success('Added to cart!'); }} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Button asChild className="bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] rounded-full px-8 py-5 text-base font-bold">
              <Link to="/combos">View All Combo Offers <ChevronRight size={18} className="ml-1 inline" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── DOCTOR CONSULTATION (Premium placeholder) ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-14 h-0.5 bg-[#D4AF37] mb-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Talk to Our Ayurvedic Experts</h2>
              <p className="text-[#2C3E30]/70 mt-4 max-w-md">Consult experienced Ayurvedic doctors for personalized health guidance and treatment recommendations tailored to you.</p>
              <div className="flex items-center gap-3 mt-6">
                <a href="tel:9911449683" className="inline-flex items-center gap-2 bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white font-semibold px-5 py-3 rounded-full">Call Now</a>
                <a href="https://wa.me/919911449683" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#D4AF37] text-[#1A4D2E] px-5 py-3 rounded-full hover:bg-[#F4F2EE]">WhatsApp Consultation</a>
              </div>
            </div>
            <div>
              <div className="bg-[#F9F7F2] rounded-2xl overflow-hidden flex items-center justify-center">
                <img 
                  src="/images/consultation.jpeg"
                  alt="Ayurvedic Doctor Consultation" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE SHAKTI AYURVED ── */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <div className="w-14 h-0.5 bg-[#D4AF37] mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Why Choose Shakti Ayurved</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <Truck size={28} className="mx-auto text-[#1A4D2E]" />
              <h3 className="font-bold text-[#1A4D2E] mt-3"><span className="mr-2 text-2xl">🚚</span>Free Delivery Across India</h3>
              <p className="text-sm text-[#2C3E30]/70 mt-2">Fast doorstep delivery.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <BadgeCheck size={28} className="mx-auto text-[#1A4D2E]" />
              <h3 className="font-bold text-[#1A4D2E] mt-3"><span className="mr-2 text-2xl">💵</span>Cash on Delivery</h3>
              <p className="text-sm text-[#2C3E30]/70 mt-2">Pay after receiving your order.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <Shield size={28} className="mx-auto text-[#1A4D2E]" />
              <h3 className="font-bold text-[#1A4D2E] mt-3"><span className="mr-2 text-2xl">🛡️</span>100% Secure Payments</h3>
              <p className="text-sm text-[#2C3E30]/70 mt-2">Trusted and safe checkout.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <Leaf size={28} className="mx-auto text-[#1A4D2E]" />
              <h3 className="font-bold text-[#1A4D2E] mt-3"><span className="mr-2 text-2xl">🌿</span>100% Natural Ayurvedic Products</h3>
              <p className="text-sm text-[#2C3E30]/70 mt-2">Prepared with authentic herbal ingredients.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <div className="w-14 h-0.5 bg-[#D4AF37] mx-auto mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A4D2E]">Certifications & Quality</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              'GMP Certified', 'FSSAI Certified', 'ISO Certified', 'Quality Tested', 'Ayurvedic Formulation', 'Trusted Manufacturing'
            ].map((label) => (
              <div key={label} className="bg-[#F9F7F2] rounded-xl p-4 text-center shadow-sm">
                <Award size={20} className="mx-auto text-[#D4AF37]" />
                <div className="font-semibold text-[#1A4D2E] text-sm mt-2">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUSTED NUMBERS / STATS ── */}
      <section className="py-12 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-extrabold text-[#1A4D2E]">10,000+</div>
              <div className="text-sm text-[#2C3E30]/70">Happy Customers</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-extrabold text-[#1A4D2E]">500+</div>
              <div className="text-sm text-[#2C3E30]/70">Daily Orders</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-extrabold text-[#1A4D2E]">100%</div>
              <div className="text-sm text-[#2C3E30]/70">Natural Products</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-extrabold text-[#1A4D2E]">24x7</div>
              <div className="text-sm text-[#2C3E30]/70">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="w-14 h-0.5 bg-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Customer Reviews</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-[#D4AF37] text-[#D4AF37]" />)}</div>
              <span className="text-[#2C3E30]/70 text-sm">4.9/5 from 2,300+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map(r => (
              <div key={r.id} className="bg-[#F9F7F2] rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} size={15} className="fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <p className="text-[#2C3E30] text-sm leading-relaxed mb-4 italic">"{r.text}"</p>
                <div className="border-t border-[#E8E4D9] pt-3">
                  <p className="font-semibold text-[#1A4D2E] text-sm">{r.name}</p>
                  <p className="text-xs text-[#2C3E30]/60">{r.location} · {r.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <div className="w-14 h-0.5 bg-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="bg-[#F9F7F2] rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-[#1A4D2E] font-semibold hover:bg-[#EDE8DF] transition-colors"
                >
                  <span className="text-sm md:text-base pr-4">{faq.q}</span>
                  <span className={`w-6 h-6 rounded-full bg-[#1A4D2E] text-white flex items-center justify-center flex-shrink-0 text-lg leading-none transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pt-3 text-sm text-[#2C3E30]/80 leading-relaxed border-t border-[#E8E4D9]">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/faq" className="text-[#1A4D2E] font-semibold text-sm hover:text-[#D4AF37] transition-colors flex items-center gap-1 justify-center">
              View all FAQs <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT US ── */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-14 h-0.5 bg-[#D4AF37] mb-5" />
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D2E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>About Shakti Ayurved</h2>
              <p className="text-[#2C3E30] leading-relaxed mb-4">
                <strong>Shakti Ayurved</strong> is dedicated to providing high-quality Ayurvedic wellness products inspired by traditional Ayurvedic knowledge and modern quality standards.
              </p>
              <p className="text-[#2C3E30] leading-relaxed mb-6">
                Our journey began with a simple belief: nature has answers to most of our health problems. Every herb in our formulations has been used for centuries in Ayurvedic medicine, combined with modern quality standards to create products that are both effective and safe.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { num: '50,000+', label: 'Happy Customers' },
                  { num: '15+', label: 'Herbal Products' },
                  { num: '95%', label: 'Satisfaction Rate' },
                  { num: '15+', label: 'Years Heritage' },
                ].map(({ num, label }) => (
                  <div key={label} className="p-4 bg-white rounded-xl text-center shadow-sm">
                    <div className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{num}</div>
                    <div className="text-xs text-[#2C3E30]/70 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <Button asChild className="bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white rounded-full">
                <Link to="/about">Learn More About Us <ChevronRight size={16} className="ml-1 inline" /></Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full bg-[#D4AF37]/10 rounded-2xl" />
              <img src={LOGO_URL} alt="Shakti Ayurved" className="relative rounded-2xl w-full shadow-xl object-contain bg-white aspect-square p-8" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT US ── */}
      <section className="py-16 bg-gradient-to-br from-[#1A4D2E] to-[#0F2F1C]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="w-14 h-0.5 bg-[#D4AF37] mb-5" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Contact Us</h2>
              <p className="text-white/70 mb-8">Have a question or need advice? Our Ayurvedic experts are here to help you.</p>
              <div className="space-y-4">
                <a href="https://wa.me/919911449683?text=Hi, I have a query about Shakti Ayurved products" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/15 rounded-xl transition-colors">
                  <div className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">WhatsApp Support</p>
                    <p className="text-white/60 text-xs">+91 9911449683 · Instant reply</p>
                  </div>
                </a>
                <a href="tel:9911449683" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/15 rounded-xl transition-colors">
                  <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Phone Support</p>
                    <p className="text-white/60 text-xs">+91 9911449683 · Mon-Sat 9AM–7PM</p>
                  </div>
                </a>
                <a href="mailto:shaktiayurved2009@gmail.com" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/15 rounded-xl transition-colors">
                  <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Email Support</p>
                    <p className="text-white/60 text-xs">shaktiayurved2009@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>
            <div id="consult" className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Free Expert Consultation</h3>
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <input type="text" placeholder="Your Full Name" value={consultForm.name}
                  onChange={e => setConsultForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#D4AF37] text-sm" />
                <input type="tel" placeholder="Your Phone Number" value={consultForm.phone}
                  onChange={e => setConsultForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#D4AF37] text-sm" />
                <Button type="submit" disabled={submitting} className="w-full bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] font-bold h-12 rounded-full text-base">
                  {submitting ? 'Submitting...' : 'Get Free Consultation'}
                </Button>
              </form>
              <p className="text-white/50 text-xs text-center mt-3">Our expert will call you back within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GUARANTEE BANNER ── */}
      <section className="bg-[#D4AF37] py-5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: RefreshCw, title: '100% Return', sub: 'Full refund!' },
              { icon: Truck, title: 'Free Shipping', sub: 'On orders ₹999+' },
              { icon: BadgeCheck, title: '100% Ayurvedic', sub: 'Pure herbs' },
              { icon: Clock, title: '24/7 Support', sub: 'Always here' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 text-[#1A4D2E]">
                <Icon size={22} className="flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">{title}</p>
                  <p className="text-xs opacity-80">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const { price: displayPrice, original_price: originalPrice, showOriginal, discountPct } = getPriceInfo(product);

  return (
    <div className="group bg-white border border-[#E8E4D9] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-[#F9F7F2] cursor-pointer" onClick={() => navigate(`/products/${product.slug}`)}>
        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500" />
        {discountPct > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{discountPct}%</span>
        )}
        <span className="absolute top-2 right-2 bg-[#D4AF37] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded-full">BESTSELLER</span>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-[#1A4D2E] text-xs md:text-sm leading-snug line-clamp-2 cursor-pointer hover:text-[#D4AF37] transition-colors mb-0.5 flex-1" onClick={() => navigate(`/products/${product.slug}`)}>
          {product.name}
        </h3>
        {product.name_hindi && <p className="text-[9px] text-[#D4AF37] mb-1.5">{product.name_hindi}</p>}
        <p className="text-[10px] text-[#2C3E30]/60 line-clamp-2 mb-2 leading-relaxed">{product.short_description}</p>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={9} className={i < Math.round(product.rating || 4.5) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200 fill-gray-200'} />)}</div>
          <span className="text-[9px] text-[#2C3E30]/50">({product.review_count || 0})</span>
        </div>
        <div className="mb-2">
          <span className="font-bold text-[#1A4D2E] text-sm">₹{displayPrice.toLocaleString()}</span>
          {showOriginal && <span className="text-[10px] text-[#2C3E30]/50 line-through ml-1">MRP ₹{originalPrice.toLocaleString()}</span>}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={onAddToCart}
            className="flex-1 flex items-center justify-center gap-1 bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white text-[10px] font-semibold py-2 rounded-lg transition-colors"
          >
            <ShoppingCart size={11} /> Add to Cart
          </button>
          <button
            onClick={() => navigate(`/products/${product.slug}`)}
            className="flex-1 flex items-center justify-center gap-1 bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] text-[10px] font-bold py-2 rounded-lg transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ComboCard implementation moved to frontend/src/components/ComboCard.jsx
