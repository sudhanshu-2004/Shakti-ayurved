import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingButtons from '@/components/FloatingButtons';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Combos from '@/pages/Combos';
import ComboDetail from '@/pages/ComboDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Checkout from '@/pages/Checkout';
import OrderSuccess from '@/pages/OrderSuccess';
import Profile from '@/pages/Profile';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ShippingPolicy from '@/pages/ShippingPolicy';
import RefundPolicy from '@/pages/RefundPolicy';
import Terms from '@/pages/Terms';

function Layout() {
  const location = useLocation();
  const hideLayout = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/combos" element={<Combos />} />
          <Route path="/combos/:slug" element={<ComboDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      {!hideLayout && <CartDrawer />}
      {!hideLayout && <FloatingButtons />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" richColors />
          <Layout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
