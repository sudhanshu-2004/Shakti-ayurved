import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Drama as Instagram, Notebook as Facebook, Route as Youtube } from 'lucide-react';

const LOGO_URL = "/images/WhatsApp_Image_2026-06-06_at_12.40.22_AM.jpeg";

export default function Footer() {
  return (
    <>
      <footer className="bg-[#1A4D2E] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1 overflow-hidden">
            <div className="flex items-center gap-3 mb-5">
              <img src={LOGO_URL} alt="SHAKTI AYURVED" className="h-12 w-12 object-contain rounded-lg flex-shrink-0" />
              <div>
                <div className="text-base font-bold tracking-wide leading-tight whitespace-nowrap">
                  <span style={{ fontFamily: "'Playfair Display', serif", color: '#fff' }}>SHAKTI </span>
                  <span style={{ fontFamily: "'Cinzel', serif", background: 'linear-gradient(90deg, #D4AF37, #F5E09C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AYURVED</span>
                </div>
                <div className="text-[#D4AF37] text-[9px] tracking-[0.15em] font-semibold">THE SOUL OF AYURVEDA</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              Premium Ayurvedic wellness brand focused on traditional herbal solutions and natural wellness products. Pure Ayurveda. Powerful Results.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} aria-label={label} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-[#D4AF37]">Categories</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Kidney Care', slug: 'kidney-care' },
                { label: 'Ear Care', slug: 'ear-care' },
                { label: 'Digestive Care', slug: 'digestive-care' },
                { label: 'Brain Care', slug: 'brain-care' },
                { label: 'Hair Care', slug: 'hair-care' },
                { label: 'Weight Management', slug: 'weight-management' },
                { label: 'Heart Care', slug: 'heart-care' },
                { label: 'Liver Care', slug: 'liver-care' },
                { label: 'Blood Pressure Care', slug: 'blood-pressure-care' },
                { label: 'Blood Sugar Care', slug: 'blood-sugar-care' },
                { label: 'Joint Care', slug: 'joint-care' },
              ].map(cat => (
                <li key={cat.slug}>
                  <Link to={`/products?category=${cat.slug}`} className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full flex-shrink-0" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-[#D4AF37]">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Products', to: '/products' },
                { label: 'Combo Offers', to: '/combos' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'FAQ', to: '/faq' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-bold text-lg mt-8 mb-4 text-[#D4AF37]">Policies</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Privacy Policy', to: '/privacy-policy' },
                { label: 'Shipping Policy', to: '/shipping-policy' },
                { label: 'Refund Policy', to: '/refund-policy' },
                { label: 'Terms & Conditions', to: '/terms' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-[#D4AF37]">My Account</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
                { label: 'My Profile', to: '/profile' },
                { label: 'My Orders', to: '/profile/orders' },
                { label: 'My Wishlist', to: '/profile/wishlist' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-[#D4AF37]">Contact Us</h4>
            <div className="space-y-4">
              <a href="tel:9911449683" className="flex items-start gap-3 text-white/70 text-sm hover:text-[#D4AF37] transition-colors">
                <Phone size={16} className="mt-0.5 flex-shrink-0 text-[#D4AF37]" />
                <div>
                  <div className="text-white font-medium">Phone / WhatsApp</div>
                  <div>+91 9911449683</div>
                </div>
              </a>
              <a href="mailto:shaktiayurved2009@gmail.com" className="flex items-start gap-3 text-white/70 text-sm hover:text-[#D4AF37] transition-colors">
                <Mail size={16} className="mt-0.5 flex-shrink-0 text-[#D4AF37]" />
                <div>
                  <div className="text-white font-medium">Email</div>
                  <div>shaktiayurved2009@gmail.com</div>
                </div>
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#D4AF37]" />
                <div>
                  <div className="text-white font-medium">Address</div>
                  <div>New Delhi, India</div>
                </div>
              </div>
              <a
                href="https://wa.me/919911449683?text=Hi, I want to know more about Shakti Ayurved products"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors mt-2"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
            <p>© {new Date().getFullYear()} Shakti Ayurved. All Rights Reserved.</p>
            <p>Made with love for natural wellness</p>
          </div>
        </div>
      </footer>

      {/* Bottom Signature Section (Compact) */}
      <section className="bg-[#071b12] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="mx-auto mb-3 h-1 w-28 rounded" style={{ background: 'linear-gradient(90deg,#D4AF37,#F5E09C)' }} />
          <div className="text-sm text-white/70 mb-1">Website Designed & Developed by</div>
          <div className="flex items-center justify-center gap-3">
            <img src={LOGO_URL} alt="Shakti Ayurved / Satish Jha" className="w-8 h-8 object-contain rounded-md" />
            <h2 className="text-sm md:text-base font-extrabold uppercase" style={{
              background: 'linear-gradient(90deg,#D4AF37,#F5E09C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>SATISH JHA</h2>
          </div>
          <div className="mt-2">
            <span className="text-xs text-white/60">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </section>
    </>
  );
}
