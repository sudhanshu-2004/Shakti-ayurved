import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const FAQ_ITEMS = [
  {
    category: 'Products',
    items: [
      { q: 'Are all Shakti Ayurved products 100% natural?', a: 'Yes, all our products are made from 100% natural Ayurvedic herbs. We do not use any synthetic chemicals, artificial preservatives, or harmful additives.' },
      { q: 'Are there any side effects?', a: 'Our products are formulated from traditional Ayurvedic herbs and are generally safe for adults. However, if you have specific medical conditions or are on medication, please consult your doctor before use.' },
      { q: 'How long before I see results?', a: 'Most customers notice improvements within 15-30 days. For chronic conditions, 2-3 months of consistent use is recommended for best results.' },
      { q: 'Can I take multiple Shakti Ayurved products together?', a: 'Yes, most of our products are safe to combine. However, we recommend consulting our experts via WhatsApp for personalized advice.' },
    ]
  },
  {
    category: 'Orders & Delivery',
    items: [
      { q: 'How long does delivery take?', a: 'We typically deliver within 5-7 business days across India. Metro cities may receive orders in 3-5 days.' },
      { q: 'Do you offer Cash on Delivery?', a: 'Yes! We offer Cash on Delivery (COD) across India. You can also pay via UPI for a seamless experience.' },
      { q: 'What is the minimum order for free shipping?', a: 'Orders above ₹999 qualify for free delivery. For orders below ₹999, a shipping charge of ₹99 is applicable.' },
      { q: 'Can I track my order?', a: 'Yes, you will receive tracking details via SMS/WhatsApp once your order is shipped. You can also contact us on WhatsApp for updates.' },
    ]
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 100% satisfaction guarantee. If you are not satisfied with any product, you can return it within 30 days of delivery for a full refund.' },
      { q: 'How do I initiate a return?', a: 'Simply WhatsApp us at +91 9911449683 with your order number and reason for return. Our team will guide you through the process.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive the returned product.' },
    ]
  },
  {
    category: 'Consultations',
    items: [
      { q: 'Do you offer free Ayurvedic consultation?', a: 'Yes! We offer free consultation by our Ayurvedic experts. Fill the consultation form on our website or WhatsApp us at +91 9911449683.' },
      { q: 'Which product is right for my condition?', a: 'Please contact our experts via WhatsApp or fill the consultation form. We will recommend the best product based on your specific health needs.' },
    ]
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggle = (key) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-white border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-2">
            <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#1A4D2E] font-medium">FAQ</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Frequently Asked Questions</h1>
          <p className="text-[#2C3E30]/70 mt-1">Find answers to common questions about our products and services</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        {FAQ_ITEMS.map((section) => (
          <div key={section.category} className="mb-8">
            <h2 className="text-lg font-bold text-[#1A4D2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#1A1A1A] text-xs font-bold">{section.category[0]}</span>
              {section.category}
            </h2>
            <div className="space-y-2">
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`;
                return (
                  <div key={key} className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F9F7F2] transition-colors"
                    >
                      <span className="text-sm font-semibold text-[#1A4D2E] pr-4">{item.q}</span>
                      <span className={`w-6 h-6 rounded-full bg-[#1A4D2E] text-white flex items-center justify-center flex-shrink-0 text-lg leading-none transition-transform ${openItems[key] ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {openItems[key] && (
                      <div className="px-5 pb-4 text-sm text-[#2C3E30]/80 leading-relaxed border-t border-[#E8E4D9] pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-br from-[#1A4D2E] to-[#0F2F1C] rounded-2xl p-6 text-center text-white">
          <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Still have questions?</h3>
          <p className="text-white/70 text-sm mb-4">Our team is here to help you 24/7</p>
          <a
            href="https://wa.me/919911449683"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
