import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-manrope text-lg text-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <CheckCircle className="w-20 h-20 text-matcha-green mx-auto mb-6" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-playfair text-5xl font-semibold tracking-tight text-charcoal mb-6"
          data-testid="order-confirmation-title"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-manrope text-base text-text-secondary mb-12"
        >
          Thank you for your order. We've sent a confirmation email to {order.customer_email}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-stone-secondary p-8 border border-[#E5E5E5] mb-12 text-left"
          data-testid="order-details"
        >
          <h2 className="font-playfair text-2xl font-semibold text-charcoal mb-6">Order Details</h2>
          
          <div className="space-y-4 font-manrope text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Order Number</span>
              <span className="text-charcoal font-medium" data-testid="order-number">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Amount</span>
              <span className="text-charcoal font-medium">₹{order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Payment Status</span>
              <span className="text-matcha-green font-medium capitalize">{order.payment_status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Order Status</span>
              <span className="text-charcoal font-medium capitalize">{order.order_status}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-4"
        >
          <Link
            to="/shop"
            className="inline-flex items-center bg-charcoal text-white hover:bg-matcha-green rounded-full px-8 py-4 transition-all duration-500 ease-out text-sm uppercase tracking-widest font-manrope"
            data-testid="continue-shopping-link"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
