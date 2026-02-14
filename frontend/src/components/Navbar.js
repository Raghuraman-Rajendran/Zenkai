import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Learn', path: '/learn' },
    { name: 'Subscribe', path: '/subscribe' },
  ];

  return (
    <>
      <div className="noise-overlay" />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="px-6 md:px-12 lg:px-24 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-playfair text-2xl font-semibold tracking-tight text-charcoal" data-testid="logo-link">
              Zenkai Matcha
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-manrope text-sm uppercase tracking-widest text-charcoal hover:text-matcha-green transition-colors duration-300"
                  data-testid={`nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => navigate('/cart')}
                className="relative"
                data-testid="cart-button"
              >
                <ShoppingCart className="w-5 h-5 text-charcoal hover:text-matcha-green transition-colors duration-300" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-matcha-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button onClick={() => navigate('/cart')} className="relative" data-testid="cart-button-mobile">
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-matcha-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-charcoal"
                data-testid="mobile-menu-button"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-stone-white border-t border-[#E5E5E5]"
              data-testid="mobile-menu"
            >
              <div className="px-6 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block font-manrope text-sm uppercase tracking-widest text-charcoal hover:text-matcha-green transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-[88px]" />
    </>
  );
};

export default Navbar;
