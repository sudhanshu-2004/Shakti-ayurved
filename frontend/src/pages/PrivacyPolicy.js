import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-white border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-2">
            <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#1A4D2E] font-medium">Privacy Policy</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Privacy Policy</h1>
          <p className="text-[#2C3E30]/60 text-sm mt-1">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 space-y-8">
        {[
          {
            title: '1. Information We Collect',
            content: `We collect information you provide directly to us, such as your name, email address, phone number, and delivery address when you create an account or place an order. We also collect usage data, device information, and browsing behavior on our website to improve your shopping experience.`
          },
          {
            title: '2. How We Use Your Information',
            content: `We use the information we collect to process your orders, send order confirmations and updates, provide customer support, send promotional communications (with your consent), improve our products and services, and comply with legal obligations.`
          },
          {
            title: '3. Information Sharing',
            content: `We do not sell, rent, or share your personal information with third parties for their marketing purposes. We may share your information with delivery partners to fulfill your orders, payment processors to process transactions, and when required by law.`
          },
          {
            title: '4. Data Security',
            content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All transactions are secured using SSL encryption.`
          },
          {
            title: '5. Cookies',
            content: `We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can control cookie settings through your browser preferences.`
          },
          {
            title: '6. Your Rights',
            content: `You have the right to access, correct, or delete your personal information at any time. You may also opt out of marketing communications by contacting us or clicking "unsubscribe" in any email we send. To exercise these rights, contact us at shaktiayurved2009@gmail.com.`
          },
          {
            title: '7. Contact Us',
            content: `If you have questions about this Privacy Policy, please contact us at:\nShakti Ayurved\nNew Delhi, India\nEmail: shaktiayurved2009@gmail.com\nPhone: +91 9911449683`
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
