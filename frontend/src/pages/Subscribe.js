import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Subscribe = () => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    plan: 'ceremonial',
    frequency: 'monthly',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/subscriptions`, formData);
      toast.success('Subscription created! Check your email for details.');
      setFormData({
        customer_name: '',
        customer_email: '',
        plan: 'ceremonial',
        frequency: 'monthly',
      });
      setLoading(false);
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Subscription failed. Please try again.');
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'ceremonial',
      name: 'Ceremonial Grade',
      price: 2499,
      discountedPrice: 2124,
      features: [
        '30g Premium Matcha',
        'First Harvest Quality',
        'Stone Ground',
        'Free Shipping',
        'Cancel Anytime',
      ],
    },
    {
      id: 'daily',
      name: 'Daily Ritual',
      price: 1499,
      discountedPrice: 1274,
      features: [
        '50g Daily Matcha',
        'Perfect for Lattes',
        'Organic',
        'Free Shipping',
        'Cancel Anytime',
      ],
    },
  ];

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-playfair text-5xl md:text-6xl font-semibold tracking-tight text-charcoal mb-6" data-testid="subscribe-title">
            Subscribe & Save 15%
          </h1>
          <p className="font-manrope text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
            Fresh matcha delivered to your door every month. Skip, pause, or cancel anytime.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16" data-testid="subscription-plans">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white border-2 p-8 ${
                formData.plan === plan.id ? 'border-matcha-green' : 'border-[#E5E5E5]'
              }`}
              data-testid={`plan-${plan.id}`}
            >
              <h3 className="font-playfair text-2xl font-semibold text-charcoal mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="font-manrope text-3xl font-semibold text-charcoal">
                  ₹{plan.discountedPrice}
                </span>
                <span className="font-manrope text-lg text-text-muted line-through ml-2">
                  ₹{plan.price}
                </span>
                <span className="font-manrope text-sm text-text-secondary ml-2">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-matcha-green flex-shrink-0 mt-0.5" />
                    <span className="font-manrope text-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => setFormData({ ...formData, plan: plan.id })}
                className={`w-full rounded-full px-8 py-4 transition-all duration-300 text-sm uppercase tracking-widest font-manrope ${
                  formData.plan === plan.id
                    ? 'bg-charcoal text-white'
                    : 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                }`}
                data-testid={`select-plan-${plan.id}`}
              >
                {formData.plan === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Subscription Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-stone-secondary p-8 md:p-12 border border-[#E5E5E5] max-w-2xl mx-auto"
        >
          <h2 className="font-playfair text-3xl font-semibold text-charcoal mb-8 text-center">
            Start Your Subscription
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
                className="w-full bg-transparent border-b border-charcoal px-0 py-4 focus:outline-none focus:border-matcha-green placeholder:text-gray-400 font-manrope text-sm"
                data-testid="subscription-name-input"
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
                data-testid="subscription-email-input"
              />
            </div>
            
            <div>
              <label className="font-manrope text-sm uppercase tracking-widest text-charcoal mb-3 block">
                Delivery Frequency
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: 'monthly' })}
                  className={`flex-1 rounded-full px-6 py-3 transition-all duration-300 text-sm uppercase tracking-widest font-manrope ${
                    formData.frequency === 'monthly'
                      ? 'bg-charcoal text-white'
                      : 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                  }`}
                  data-testid="frequency-monthly"
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: 'biweekly' })}
                  className={`flex-1 rounded-full px-6 py-3 transition-all duration-300 text-sm uppercase tracking-widest font-manrope ${
                    formData.frequency === 'biweekly'
                      ? 'bg-charcoal text-white'
                      : 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                  }`}
                  data-testid="frequency-biweekly"
                >
                  Bi-Weekly
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-white hover:bg-matcha-green rounded-full px-8 py-4 transition-all duration-500 ease-out text-sm uppercase tracking-widest font-manrope disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="subscribe-submit-button"
            >
              {loading ? 'Processing...' : 'Start Subscription'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscribe;
