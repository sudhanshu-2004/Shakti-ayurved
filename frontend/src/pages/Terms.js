import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-white border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-2">
            <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#1A4D2E] font-medium">Terms & Conditions</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Terms & Conditions</h1>
          <p className="text-[#2C3E30]/60 text-sm mt-1">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-4 text-sm text-[#2C3E30]/80">
          By using the Shakti Ayurved website and purchasing our products, you agree to be bound by these Terms & Conditions. Please read them carefully before placing an order.
        </div>

        {[
          {
            title: '1. General',
            content: `These Terms & Conditions govern your use of the Shakti Ayurved website and the purchase of products from us. By accessing our website or placing an order, you accept these terms in full.\n\nShakti Ayurved reserves the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.`
          },
          {
            title: '2. Products & Health Disclaimer',
            content: `All products sold by Shakti Ayurved are dietary supplements based on traditional Ayurvedic formulations. They are not intended to diagnose, treat, cure, or prevent any disease.\n\nResults may vary between individuals. We strongly recommend consulting a qualified healthcare provider before starting any new supplement, especially if you are pregnant, nursing, have a medical condition, or are taking prescription medications.\n\nOur products are not substitutes for professional medical advice, diagnosis, or treatment.`
          },
          {
            title: '3. Orders & Pricing',
            content: `All prices are in Indian Rupees (₹) and are inclusive of applicable taxes. We reserve the right to modify prices without prior notice.\n\nAn order is confirmed only after successful payment (UPI) or order placement (COD). We reserve the right to cancel any order at our sole discretion, in which case a full refund will be issued.\n\nIn case of pricing errors, we will contact you before processing the order.`
          },
          {
            title: '4. Payment',
            content: `We accept:\n• Cash on Delivery (COD) — available across India\n• UPI — payment must be made within 24 hours of order placement to the UPI ID provided\n\nFor UPI orders, please send the payment screenshot to WhatsApp +91 9911449683 to confirm your order.`
          },
          {
            title: '5. Shipping & Delivery',
            content: `Please refer to our Shipping Policy for detailed information on delivery timelines and charges. While we strive to deliver within the estimated timeline, we are not liable for delays caused by courier partners, natural events, or circumstances beyond our control.`
          },
          {
            title: '6. Returns & Refunds',
            content: `Please refer to our Refund & Returns Policy for full details. We offer a 30-day return window and 100% satisfaction guarantee on all products.`
          },
          {
            title: '7. Intellectual Property',
            content: `All content on this website including text, images, logos, and product descriptions is the intellectual property of Shakti Ayurved. You may not reproduce, distribute, or use any content without prior written permission.`
          },
          {
            title: '8. Limitation of Liability',
            content: `Shakti Ayurved shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our maximum liability for any claim shall not exceed the amount paid for the relevant product.`
          },
          {
            title: '9. Governing Law',
            content: `These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India.`
          },
          {
            title: '10. Contact',
            content: `For questions about these Terms & Conditions:\nShakti Ayurved\nNew Delhi, India\nEmail: shaktiayurved2009@gmail.com\nPhone: +91 9911449683`
          },
        ].map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-xl font-bold text-[#1A4D2E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{title}</h2>
            <p className="text-[#2C3E30]/80 text-sm leading-relaxed whitespace-pre-line">{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
