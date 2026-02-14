import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Heart, Zap, Leaf } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  useEffect(() => {
    fetchProducts();
    
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem('email_popup_shown');
      if (!hasSeenPopup) {
        setShowEmailPopup(true);
        sessionStorage.setItem('email_popup_shown', 'true');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/email-capture`, { email });
      setEmail('');
      setShowEmailPopup(false);
      alert('Thank you for subscribing!');
    } catch (error) {
      console.error('Error capturing email:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1766485586335-b3ecea463aa6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwzfHxncmVlbiUyMHRlYSUyMHBsYW50YXRpb24lMjBmb2d8ZW58MHx8fHwxNzcxMDY3MjM3fDA&ixlib=rb-4.1.0&q=85"
            alt="Uji Tea Plantation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-white/95 via-stone-white/70 to-transparent" />
        </div>
        
        <div className="relative px-6 md:px-12 lg:px-24 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-playfair text-5xl md:text-7xl font-semibold tracking-tight text-charcoal mb-6"
            data-testid="hero-title"
          >
            Calm Energy.
            <br />
            Pure Focus.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-manrope text-base md:text-lg text-text-secondary mb-10 max-w-lg"
          >
            Premium ceremonial-grade matcha from Uji, Japan. Ancient tradition meets modern ritual.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-charcoal text-white hover:bg-matcha-green rounded-full px-8 py-4 transition-all duration-500 ease-out text-sm uppercase tracking-widest font-manrope"
              data-testid="shop-now-button"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24" data-testid="featured-products">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-4">
              Our Matcha Collection
            </h2>
            <p className="font-manrope text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
              Sourced directly from the historic tea gardens of Uji, Japan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white rounded-full px-8 py-4 transition-all duration-300 text-sm uppercase tracking-widest font-manrope"
              data-testid="view-all-products-button"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-stone-secondary" data-testid="benefits-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-4">
              The Zenkai Difference
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-matcha-green/10 rounded-full mb-6">
                <Zap className="w-8 h-8 text-matcha-green" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Sustained Energy</h3>
              <p className="font-manrope text-sm text-text-secondary">
                No jitters, no crash. Just calm, focused energy for 4-6 hours.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-matcha-green/10 rounded-full mb-6">
                <Sparkles className="w-8 h-8 text-matcha-green" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Mental Clarity</h3>
              <p className="font-manrope text-sm text-text-secondary">
                L-theanine promotes relaxation and focus without drowsiness.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-matcha-green/10 rounded-full mb-6">
                <Heart className="w-8 h-8 text-matcha-green" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Rich in Antioxidants</h3>
              <p className="font-manrope text-sm text-text-secondary">
                137x more antioxidants than regular green tea.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-matcha-green/10 rounded-full mb-6">
                <Leaf className="w-8 h-8 text-matcha-green" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">100% Organic</h3>
              <p className="font-manrope text-sm text-text-secondary">
                Shade-grown, stone-ground, and pesticide-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Prepare */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24" data-testid="how-to-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1753009712810-3f72c3f72548?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwxfHxjZXJlbW9uaWFsJTIwbWF0Y2hhJTIwcG93ZGVyJTIwYm93bCUyMHdoaXNrfGVufDB8fHx8MTc3MTA2NzIyNXww&ixlib=rb-4.1.0&q=85"
                alt="Whisking Matcha"
                className="w-full aspect-square object-cover"
              />
            </div>
            
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-8">
                The Ritual
              </h2>
              
              <div className="space-y-6 font-manrope text-base text-text-secondary">
                <div className="flex space-x-4">
                  <span className="font-semibold text-charcoal">01.</span>
                  <p>Sift 1-2 teaspoons of matcha into your bowl</p>
                </div>
                <div className="flex space-x-4">
                  <span className="font-semibold text-charcoal">02.</span>
                  <p>Add 60ml of hot water (75-80°C)</p>
                </div>
                <div className="flex space-x-4">
                  <span className="font-semibold text-charcoal">03.</span>
                  <p>Whisk vigorously in a zigzag motion until frothy</p>
                </div>
                <div className="flex space-x-4">
                  <span className="font-semibold text-charcoal">04.</span>
                  <p>Enjoy your moment of calm clarity</p>
                </div>
              </div>
              
              <Link
                to="/learn"
                className="inline-flex items-center space-x-2 mt-10 text-charcoal border-b border-charcoal pb-1 hover:border-transparent transition-all font-manrope text-sm uppercase tracking-widest"
                data-testid="learn-more-button"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-stone-secondary" data-testid="testimonials-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-16">
            What Our Community Says
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#E5E5E5]">
              <div className="mb-4">
                <span className="text-matcha-green text-2xl">★★★★★</span>
              </div>
              <p className="font-manrope text-sm text-text-secondary mb-4">
                "Best matcha I've tried in India. The quality is exceptional and the taste is so smooth."
              </p>
              <p className="font-manrope text-sm font-medium text-charcoal">- Priya S.</p>
            </div>
            
            <div className="bg-white p-8 border border-[#E5E5E5]">
              <div className="mb-4">
                <span className="text-matcha-green text-2xl">★★★★★</span>
              </div>
              <p className="font-manrope text-sm text-text-secondary mb-4">
                "My morning coffee replacement. I feel more focused and energized throughout the day."
              </p>
              <p className="font-manrope text-sm font-medium text-charcoal">- Arjun M.</p>
            </div>
            
            <div className="bg-white p-8 border border-[#E5E5E5]">
              <div className="mb-4">
                <span className="text-matcha-green text-2xl">★★★★★</span>
              </div>
              <p className="font-manrope text-sm text-text-secondary mb-4">
                "The subscription is perfect. Fresh matcha delivered every month without thinking about it."
              </p>
              <p className="font-manrope text-sm font-medium text-charcoal">- Sneha D.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24" data-testid="subscription-cta">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-6">
            Never Run Out
          </h2>
          <p className="font-manrope text-base md:text-lg text-text-secondary mb-10">
            Subscribe and save 15%. Fresh matcha delivered to your door every month.
          </p>
          <Link
            to="/subscribe"
            className="inline-flex items-center space-x-2 bg-charcoal text-white hover:bg-matcha-green rounded-full px-8 py-4 transition-all duration-500 ease-out text-sm uppercase tracking-widest font-manrope"
            data-testid="subscribe-button"
          >
            <span>Start Subscription</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Email Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 px-6" data-testid="email-popup">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-12 max-w-md w-full relative"
          >
            <button
              onClick={() => setShowEmailPopup(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-charcoal"
              data-testid="close-popup-button"
            >
              ✕
            </button>
            <h3 className="font-playfair text-2xl font-semibold text-charcoal mb-4">
              Join the Ritual
            </h3>
            <p className="font-manrope text-sm text-text-secondary mb-6">
              Get 10% off your first order plus wellness tips and exclusive offers.
            </p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-transparent border-b border-charcoal px-0 py-4 focus:outline-none focus:border-matcha-green placeholder:text-gray-400 font-manrope text-sm mb-6"
                required
                data-testid="email-input"
              />
              <button
                type="submit"
                className="w-full bg-charcoal text-white hover:bg-matcha-green rounded-full px-8 py-4 transition-all duration-500 ease-out text-sm uppercase tracking-widest font-manrope"
                data-testid="submit-email-button"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
