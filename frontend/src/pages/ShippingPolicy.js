import { Link } from 'react-router-dom';
import { ChevronRight, Truck, Clock, MapPin, Package } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-white border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-2">
            <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#1A4D2E] font-medium">Shipping Policy</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Shipping Policy</h1>
          <p className="text-[#2C3E30]/60 text-sm mt-1">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999 across India' },
            { icon: Clock, title: '5-7 Business Days', desc: 'Standard delivery timeline' },
            { icon: MapPin, title: 'Pan India Delivery', desc: 'We ship to all states in India' },
            { icon: Package, title: 'Secure Packaging', desc: 'Products packed safely to avoid damage' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-5 flex gap-4 shadow-sm">
              <div className="w-10 h-10 bg-[#1A4D2E] rounded-full flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-[#D4AF37]" />
              </div>
              <div>
                <p className="font-semibold text-[#1A4D2E] text-sm">{title}</p>
                <p className="text-xs text-[#2C3E30]/70 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {[
            {
              title: '1. Order Processing Time',
              content: `Orders are processed within 1-2 business days of payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day. You will receive an order confirmation email/SMS once your order is processed.`
            },
            {
              title: '2. Delivery Timeline',
              content: `Standard Delivery: 5-7 business days across India.\nMetro Cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata): 3-5 business days.\nRemote areas and North-East India may take 7-10 business days.\nDelivery times are estimates and may vary due to factors beyond our control such as weather conditions or courier delays.`
            },
            {
              title: '3. Shipping Charges',
              content: `Free shipping on all orders above ₹999.\nOrders below ₹999: Flat ₹99 shipping charge.\nShipping charges are calculated and displayed at checkout before payment.`
            },
            {
              title: '4. Order Tracking',
              content: `Once your order is shipped, you will receive a tracking number via SMS and WhatsApp. You can track your order using this number on our courier partner's website or by contacting us on WhatsApp at +91 9911449683.`
            },
            {
              title: '5. Delivery Issues',
              content: `If your order is not delivered within the estimated timeline, please contact us at +91 9911449683 or shaktiayurved2009@gmail.com. We will investigate and resolve the issue promptly.\n\nIn case of a failed delivery attempt, our courier partner will try to deliver 2 more times. After 3 failed attempts, the package will be returned to us.`
            },
            {
              title: '6. Damaged or Missing Items',
              content: `If you receive a damaged product or if any items are missing from your order, please contact us within 48 hours of delivery with photos of the damaged package/product. We will arrange a replacement or refund at no extra cost.`
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
