import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3">
      <a
        href="https://wa.me/919911449683?text=Hi, I have a query about Shakti Ayurved products"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className="w-13 h-13 w-[52px] h-[52px] bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 whatsapp-pulse"
      >
        <MessageCircle size={24} />
      </a>
      <a
        href="tel:+919911449683"
        title="Call Now"
        className="w-[52px] h-[52px] bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      >
        <Phone size={22} />
      </a>
    </div>
  );
}
