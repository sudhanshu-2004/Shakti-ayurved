import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const LOGO_URL = "/images/WhatsApp_Image_2026-06-06_at_12.40.22_AM.jpeg";

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.phone.length < 10) { toast.error('Enter a valid phone number'); return; }

    setLoading(true);
    try {
      await signUp({ email: form.email, password: form.password, fullName: form.fullName, phone: form.phone });
      toast.success('Account created! Welcome to Shakti Ayurved!');
      navigate('/');
    } catch (err) {
      if (err.message?.includes('already registered')) toast.error('Email already in use. Please login.');
      else toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <img src={LOGO_URL} alt="Shakti Ayurved" className="w-full h-full object-contain rounded-md mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A4D2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Create Account</h1>
          <p className="text-[#2C3E30]/60 mt-1 text-sm">Join Shakti Ayurved for natural wellness</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Full Name</label>
              <Input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Your full name" required className="h-11 border-[#E8E4D9] focus:border-[#1A4D2E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Email Address</label>
              <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" required className="h-11 border-[#E8E4D9] focus:border-[#1A4D2E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Phone Number</label>
              <Input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit mobile number" required className="h-11 border-[#E8E4D9] focus:border-[#1A4D2E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Password</label>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 characters" required className="h-11 pr-10 border-[#E8E4D9] focus:border-[#1A4D2E]" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C3E30]/50">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E30] mb-1.5">Confirm Password</label>
              <Input type="password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Re-enter password" required className="h-11 border-[#E8E4D9] focus:border-[#1A4D2E]" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white h-11 rounded-full font-semibold mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm">
            <span className="text-[#2C3E30]/60">Already have an account? </span>
            <Link to="/login" className="text-[#1A4D2E] font-semibold hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
