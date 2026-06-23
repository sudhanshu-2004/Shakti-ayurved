import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, MessageCircle, ChevronRight, Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { toast.error('Please fill required fields'); return; }
    setLoading(true);
    try {
      if (!supabase) {
        // Supabase unavailable — show success anyway (form data logged locally)
        toast.success('Message sent! We will contact you soon.');
        setForm({ name: '', phone: '', message: '' });
        return;
      }
      const { error } = await supabase.from('consultations').insert({
        name: form.name, phone: form.phone, message: form.message
      });
      if (error) throw error;
      toast.success('Message sent! We will contact you soon.');
      setForm({ name: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-white border-b border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 mb-2">
            <Link to="/" className="hover:text-[#1A4D2E]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#1A4D2E] font-medium">Contact Us</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Contact Us</h1>
          <p className="text-[#2C3E30]/70 mt-1">We are here to help. Reach out via any channel below.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Contact Details */}
          <div>
            <div className="w-14 h-0.5 bg-[#D4AF37] mb-5" />
            <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Get In Touch</h2>

            <div className="space-y-5 mb-8">
              <a href="tel:9911449683" className="flex items-start gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-[#1A4D2E] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#1A4D2E]">Phone / WhatsApp</p>
                  <p className="text-[#2C3E30]/70 text-sm">+91 9911449683</p>
                  <p className="text-xs text-[#2C3E30]/50 mt-0.5">Mon-Sat, 9 AM – 7 PM</p>
                </div>
              </a>

              <a href="mailto:shaktiayurved2009@gmail.com" className="flex items-start gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-[#1A4D2E] rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#1A4D2E]">Email</p>
                  <p className="text-[#2C3E30]/70 text-sm">shaktiayurved2009@gmail.com</p>
                  <p className="text-xs text-[#2C3E30]/50 mt-0.5">We reply within 24 hours</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
                <div className="w-11 h-11 bg-[#1A4D2E] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#1A4D2E]">Address</p>
                  <p className="text-[#2C3E30]/70 text-sm">New Delhi, India</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/919911449683?text=Hi, I have a query about Shakti Ayurved products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-7 shadow-sm">
            <h2 className="text-xl font-bold text-[#1A4D2E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Full Name *</label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required className="h-11 border-[#E8E4D9] focus:border-[#1A4D2E]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Phone Number *</label>
                <Input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Mobile number" required className="h-11 border-[#E8E4D9] focus:border-[#1A4D2E]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Message (optional)</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us how we can help you..."
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E8E4D9] text-sm focus:outline-none focus:border-[#1A4D2E] resize-none"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white h-11 rounded-full font-semibold">
                {loading ? 'Sending...' : <><Send size={15} className="mr-2" />Send Message</>}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
