import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Phone, Mail, ChevronDown, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LOGO_URL = "/images/WhatsApp_Image_2026-06-06_at_12.40.22_AM.jpeg";

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Combo Offers', to: '/combos' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { count, setIsOpen } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1A4D2E] text-white py-2 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:9911449683" className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
              <Phone size={12} /> +91 9911449683
            </a>
            <a href="mailto:shaktiayurved2009@gmail.com" className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
              <Mail size={12} /> shaktiayurved2009@gmail.com
            </a>
          </div>
          <span className="text-[#D4AF37] font-semibold tracking-wide">
            Free Delivery | 100% Return Guarantee | Cash on Delivery
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={LOGO_URL} alt="SHAKTI AYURVED" className="h-10 md:h-14 w-auto" />
              <div>
                <div className="site-title text-base sm:text-xl md:text-2xl leading-tight">
                  <span className="shakti">SHAKTI</span>
                  <span className="ayurved">AYURVED</span>
                </div>
                <div className="hidden sm:block text-[9px] tracking-[0.2em] text-[#1A4D2E] font-semibold uppercase">The Soul of Ayurveda</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative group ${
                    location.pathname === link.to
                      ? 'text-[#1A4D2E] font-semibold'
                      : 'text-[#2C3E30] hover:text-[#1A4D2E]'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-[#D4AF37] transform transition-transform origin-left ${
                    location.pathname === link.to ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs relative">
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pr-10 h-9 text-sm border-[#E8E4D9] focus:border-[#1A4D2E]"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1A4D2E]">
                <Search size={16} />
              </button>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Wishlist */}
              {user && (
                <Link to="/profile/wishlist" className="p-2 text-[#2C3E30] hover:text-[#1A4D2E] transition-colors hidden md:block">
                  <Heart size={20} />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-[#2C3E30] hover:text-[#1A4D2E] transition-colors"
              >
                <ShoppingCart size={22} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-[#1A1A1A] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1 p-2 text-[#2C3E30] hover:text-[#1A4D2E] transition-colors"
                  >
                    <User size={20} />
                    <ChevronDown size={14} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-[#E8E4D9] py-2 z-50">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-[#2C3E30] hover:bg-[#F9F7F2] hover:text-[#1A4D2E]" onClick={() => setUserMenuOpen(false)}>My Profile</Link>
                      <Link to="/profile/orders" className="block px-4 py-2 text-sm text-[#2C3E30] hover:bg-[#F9F7F2] hover:text-[#1A4D2E]" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                      <Link to="/profile/wishlist" className="block px-4 py-2 text-sm text-[#2C3E30] hover:bg-[#F9F7F2] hover:text-[#1A4D2E]" onClick={() => setUserMenuOpen(false)}>Wishlist</Link>
                      <div className="border-t border-[#E8E4D9] mt-1 pt-1">
                        <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="border-[#1A4D2E] text-[#1A4D2E] hover:bg-[#1A4D2E] hover:text-white text-xs h-8">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] text-xs h-8 font-semibold">
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-[#2C3E30]"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#E8E4D9] bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex gap-2 mb-3">
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="h-9 text-sm"
                />
                <Button type="submit" size="sm" className="bg-[#1A4D2E] text-white h-9 px-3">
                  <Search size={16} />
                </Button>
              </form>
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-[#1A4D2E] text-white'
                      : 'text-[#2C3E30] hover:bg-[#F9F7F2]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-[#E8E4D9] flex gap-2">
                {user ? (
                  <>
                    <Link to="/profile" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-[#1A4D2E] text-[#1A4D2E]">Profile</Button>
                    </Link>
                    <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-600" onClick={handleSignOut}>Sign Out</Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full border-[#1A4D2E] text-[#1A4D2E]">Login</Button></Link>
                    <Link to="/register" className="flex-1"><Button size="sm" className="w-full bg-[#D4AF37] text-[#1A1A1A] font-semibold">Register</Button></Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
