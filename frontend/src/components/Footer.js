import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-secondary border-t border-[#E5E5E5] py-24">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="font-playfair text-2xl font-semibold mb-6" data-testid="footer-brand">Zenkai Matcha</h3>
            <p className="font-manrope text-sm text-text-secondary">
              Premium ceremonial-grade matcha sourced from Uji, Japan.
            </p>
          </div>
          
          <div>
            <h4 className="font-manrope text-sm uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-3 font-manrope text-sm text-text-secondary">
              <li><Link to="/shop" className="hover:text-matcha-green transition-colors" data-testid="footer-all-products">All Products</Link></li>
              <li><Link to="/shop?category=matcha" className="hover:text-matcha-green transition-colors">Matcha</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-matcha-green transition-colors">Accessories</Link></li>
              <li><Link to="/subscribe" className="hover:text-matcha-green transition-colors" data-testid="footer-subscribe">Subscribe</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-manrope text-sm uppercase tracking-widest mb-6">Learn</h4>
            <ul className="space-y-3 font-manrope text-sm text-text-secondary">
              <li><Link to="/about" className="hover:text-matcha-green transition-colors" data-testid="footer-about">About Us</Link></li>
              <li><Link to="/learn" className="hover:text-matcha-green transition-colors" data-testid="footer-learn">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-manrope text-sm uppercase tracking-widest mb-6">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-charcoal hover:text-matcha-green transition-colors" data-testid="footer-instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:hello@zenkaimatcha.com" className="text-charcoal hover:text-matcha-green transition-colors" data-testid="footer-email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#E5E5E5] pt-8">
          <p className="font-manrope text-xs text-text-muted text-center">
            © 2026 Zenkai Matcha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
