import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in backend
      const orderResponse = await axios.post(`${API}/orders/create`, {
        ...formData,
        items: cart.items,
        total_amount: getCartTotal(),
      });

      const order = orderResponse.data;

      // Create Razorpay order
      const razorpayOrderResponse = await axios.post(`${API}/orders/create-razorpay-order`, {
        amount: getCartTotal(),
        order_id: order.id,
      });

      const razorpayOrder = razorpayOrderResponse.data;

      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        setLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Zenkai Matcha',
        description: 'Premium Matcha Products',
        order_id: razorpayOrder.razorpay_order_id,
        handler: async function (response) {
          try {
            await axios.post(`${API}/orders/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id,
            });
            
            toast.success('Payment successful!');
            await clearCart();
            navigate(`/order-confirmation/${order.id}`);
          } catch (error) {
            toast.error('Payment verification failed');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: formData.customer_name,
          email: formData.customer_email,
          contact: formData.customer_phone,
        },
        theme: {
          color: '#5C7C3E',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-playfair text-5xl font-semibold tracking-tight text-charcoal mb-12"
          data-testid="checkout-title"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white border border-[#E5E5E5] p-8"
          >
            <h2 className="font-playfair text-2xl font-semibold text-charcoal mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                  className="w-full bg-transparent border-b border-charcoal px-0 py-4 focus:outline-none focus:border-matcha-green placeholder:text-gray-400 font-manrope text-sm"
                  data-testid="customer-name-input"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="w-full bg-transparent border-b border-charcoal px-0 py-4 focus:outline-none focus:border-matcha-green placeholder:text-gray-400 font-manrope text-sm"
                  data-testid="customer-email-input"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                  className="w-full bg-transparent border-b border-charcoal px-0 py-4 focus:outline-none focus:border-matcha-green placeholder:text-gray-400 font-manrope text-sm"
                  data-testid="customer-phone-input"
                />
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white border border-[#E5E5E5] p-8"
          >
            <h2 className="font-playfair text-2xl font-semibold text-charcoal mb-6">
              Shipping Address
            </h2>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  required
                  className="w-full bg-transparent border-b border-charcoal px-0 py-4 focus:outline-none focus:border-matcha-green placeholder:text-gray-400 font-manrope text-sm"
                  data-testid="address-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                    className="w-full bg-transparent border-b border-charcoal px-0 py-4 focus:outline-none focus:border-matcha-green placeholder:text-gray-400 font-manrope text-sm"
                    data-testid="city-input"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                    className="w-full bg-transparent border-b border-charcoal px-0 py-4 focus:outline-none focus:border-matcha-green placeholder:text-gray-400 font-manrope text-sm"
                    data-testid="state-input"
                  />
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  required
                  className="w-full bg-transparent border-b border-charcoal px-0 py-4 focus:outline-none focus:border-matcha-green placeholder:text-gray-400 font-manrope text-sm"
                  data-testid="pincode-input"
                />
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-stone-secondary p-8 border border-[#E5E5E5]"
          >
            <h2 className="font-playfair text-2xl font-semibold text-charcoal mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between font-manrope text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-charcoal font-medium">₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-manrope text-sm">
                <span className="text-text-secondary">Shipping</span>
                <span className="text-charcoal font-medium">Free</span>
              </div>
              <div className="border-t border-[#E5E5E5] pt-4 flex justify-between font-manrope text-xl">
                <span className="text-charcoal font-semibold">Total</span>
                <span className="text-charcoal font-semibold" data-testid="checkout-total">
                  ₹{getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-white hover:bg-matcha-green rounded-full px-8 py-4 transition-all duration-500 ease-out text-sm uppercase tracking-widest font-manrope disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="place-order-button"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
