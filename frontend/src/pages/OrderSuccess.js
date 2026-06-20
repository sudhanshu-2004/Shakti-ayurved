import { useLocation, Link } from 'react-router-dom';
import { CircleCheck as CheckCircle, Package, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderSuccess() {
  const location = useLocation();
  const { order, paymentMethod } = location.state || {};

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-[#1A4D2E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Order Placed Successfully!
          </h1>
          <p className="text-[#2C3E30]/70 text-sm mb-5">
            Thank you for your order. We will process and dispatch it shortly.
          </p>

          {order && (
            <div className="bg-[#F9F7F2] rounded-xl p-4 mb-5 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Package size={16} className="text-[#D4AF37]" />
                <span className="font-semibold text-[#1A4D2E] text-sm">Order Details</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#2C3E30]/60">Order Number</span>
                  <span className="font-semibold text-[#1A4D2E]">{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2C3E30]/60">Total Amount</span>
                  <span className="font-semibold text-[#1A4D2E]">₹{order.total?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2C3E30]/60">Payment</span>
                  <span className="font-semibold text-[#1A4D2E] capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2C3E30]/60">Status</span>
                  <span className="text-yellow-600 font-semibold capitalize">{order.status}</span>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-left text-sm">
              <p className="font-semibold text-blue-800 mb-1">UPI Payment Instructions</p>
              <p className="text-blue-700">Pay ₹{order?.total?.toLocaleString()} to UPI ID: <strong>ayurvedlife@upi</strong></p>
              <p className="text-blue-700 mt-1">Send payment screenshot to WhatsApp: <strong>+91 9911449683</strong></p>
            </div>
          )}

          <div className="space-y-2.5">
            <div className="flex items-center justify-center gap-2 text-sm text-[#2C3E30]/70">
              <Phone size={14} className="text-[#1A4D2E]" />
              <span>Our team will call you within 24 hours</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button asChild className="flex-1 bg-[#1A4D2E] hover:bg-[#0F2F1C] text-white rounded-full">
                <Link to="/profile/orders">My Orders</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-[#1A4D2E] text-[#1A4D2E] rounded-full">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
            <a
              href="https://wa.me/919911449683"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#25D366] hover:underline mt-2"
            >
              <MessageCircle size={14} /> Track order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
