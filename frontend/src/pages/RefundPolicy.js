import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw, CircleCheck as CheckCircle, Circle as XCircle, Clock } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-white border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-2">
            <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#1A4D2E] font-medium">Refund & Returns Policy</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Refund & Returns Policy</h1>
          <p className="text-[#2C3E30]/60 text-sm mt-1">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        <div className="bg-gradient-to-br from-[#1A4D2E] to-[#0F2F1C] rounded-2xl p-6 text-white mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>100% Satisfaction Guarantee</h2>
          <p className="text-white/80 text-sm">We stand behind every product we sell. If you are not completely satisfied, we will make it right — no questions asked.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { icon: CheckCircle, title: 'Accepted', color: 'text-green-600', bg: 'bg-green-50', items: ['Damaged products', 'Wrong item received', 'Product defects', 'Unopened products within 30 days'] },
            { icon: XCircle, title: 'Not Accepted', color: 'text-red-500', bg: 'bg-red-50', items: ['Opened products (unless defective)', 'Returns after 30 days', 'Products without original packaging', 'Change of mind (contact us first)'] },
          ].map(({ icon: Icon, title, color, bg, items }) => (
            <div key={title} className={`${bg} rounded-xl p-5`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={18} className={color} />
                <span className="font-semibold text-[#1A4D2E] text-sm">{title}</span>
              </div>
              <ul className="space-y-1">
                {items.map(item => (
                  <li key={item} className="text-xs text-[#2C3E30]/80 flex items-start gap-1.5">
                    <span className="mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {[
            {
              title: '1. Return Window',
              content: `You can request a return within 30 days of receiving your order. After 30 days, we are unable to accept returns unless the product is defective or damaged.`
            },
            {
              title: '2. How to Initiate a Return',
              content: `Step 1: WhatsApp us at +91 9911449683 or email shaktiayurved2009@gmail.com within 30 days of delivery.\nStep 2: Provide your order number and reason for return along with photos of the product.\nStep 3: Our team will review your request within 24 hours and provide return instructions.\nStep 4: Pack the product securely in its original packaging and ship it to the address provided.`
            },
            {
              title: '3. Refund Processing',
              content: `Once we receive and inspect the returned product, we will process your refund within 5-7 business days.\n\nRefund Methods:\n• Original payment method (UPI/bank transfer)\n• Wallet credit for faster processing\n• Cash on Delivery orders: Bank transfer within 5-7 days`
            },
            {
              title: '4. Damaged or Defective Products',
              content: `If you receive a damaged or defective product, please contact us within 48 hours of delivery with clear photos. We will arrange a free replacement or full refund — no need to return the product.`
            },
            {
              title: '5. Return Shipping',
              content: `For returns due to our error (wrong item, damaged product, defective product), we will bear the return shipping cost.\n\nFor other returns, the customer is responsible for return shipping charges.`
            },
            {
              title: '6. Non-Returnable Items',
              content: `For hygiene reasons, the following items cannot be returned once opened:\n• Powders and loose herb products\n• Products with broken seals\n\nHowever, if these products are defective, we will replace them.`
            },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-[#1A4D2E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{title}</h2>
              <p className="text-[#2C3E30]/80 text-sm leading-relaxed whitespace-pre-line">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
