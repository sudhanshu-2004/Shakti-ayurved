import { Link } from 'react-router-dom';
import { ChevronRight, Leaf, Heart, Award, Users, Shield, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LOGO_URL = "/images/WhatsApp_Image_2026-06-06_at_12.40.22_AM.jpeg";
const HERO_IMAGE = "/images/WhatsApp_Image_2026-06-05_at_10.54.04_PM.jpeg";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-white border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-2">
            <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#1A4D2E] font-medium">About Us</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>About Shakti Ayurved</h1>
        </div>
      </div>

      {/* Hero Story */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-14 h-0.5 bg-[#D4AF37] mb-5" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D2E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Soul of Ayurveda
            </h2>
            <p className="text-[#2C3E30] leading-relaxed mb-4">
              <strong>Shakti Ayurved</strong> is a premium Ayurvedic wellness brand committed to bringing the ancient wisdom of Ayurveda into modern lives. Founded with a deep respect for nature and traditional healing, we craft each product with the highest care and scientific backing.
            </p>
            <p className="text-[#2C3E30] leading-relaxed mb-4">
              Our journey began with a simple belief: nature has answers to most of our health problems. Every herb in our formulations has been used for centuries in Ayurvedic medicine, and we have combined this ancient wisdom with modern quality standards to create products that are both effective and safe.
            </p>
            <p className="text-[#2C3E30] leading-relaxed">
              Today, Shakti Ayurved serves thousands of customers across India, helping them achieve better health naturally — without harmful chemicals or side effects.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-full h-full bg-[#D4AF37]/10 rounded-2xl" />
            <img src={LOGO_URL} alt="Shakti Ayurved" className="relative rounded-2xl w-full shadow-xl" />
          </div>
        </div>
      </section>

      {/* Mission Values */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <div className="w-14 h-0.5 bg-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Our Mission & Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To make authentic Ayurvedic healthcare accessible to every Indian household through high-quality, affordable, and effective herbal products.' },
              { icon: Heart, title: 'Our Vision', desc: 'A healthier India through the power of Ayurveda — where natural wellness is the first choice, not the last resort.' },
              { icon: Leaf, title: 'Our Promise', desc: '100% natural ingredients, zero harmful chemicals, transparent formulations, and a complete money-back guarantee on every product.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 bg-[#F9F7F2] rounded-2xl">
                <div className="w-14 h-14 bg-[#1A4D2E] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-[#D4AF37]" />
                </div>
                <h3 className="font-bold text-[#1A4D2E] text-lg mb-2">{title}</h3>
                <p className="text-sm text-[#2C3E30]/80 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-14 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="w-14 h-0.5 bg-[#D4AF37] mb-5" />
            <h2 className="text-3xl font-bold text-[#1A4D2E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Why Thousands Trust Us</h2>
            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Authentic Formulations', desc: 'Every product is formulated based on classical Ayurvedic texts by expert practitioners.' },
                { icon: Award, title: 'Quality Assured', desc: 'We follow strict quality control processes from raw material sourcing to final packaging.' },
                { icon: Users, title: '50,000+ Happy Customers', desc: 'Our growing community of satisfied customers across India is our biggest achievement.' },
                { icon: Heart, title: 'Customer First', desc: '24/7 support, free consultations, and a hassle-free return policy — your satisfaction is guaranteed.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#1A4D2E]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1A4D2E] text-sm">{title}</h4>
                    <p className="text-xs text-[#2C3E30]/70 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#1A4D2E] to-[#0F2F1C] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Our Numbers Speak</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { num: '50,000+', label: 'Customers Served' },
                { num: '10+', label: 'Herbal Products' },
                { num: '95%', label: 'Satisfaction Rate' },
                { num: '15+', label: 'Years of Heritage' },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{num}</div>
                  <div className="text-white/70 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild className="w-full bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] font-bold rounded-full">
                <Link to="/products">Explore Our Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
