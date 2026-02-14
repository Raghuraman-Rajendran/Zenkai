import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [products, setProducts] = useState({});

  useEffect(() => {
    if (cart?.items?.length > 0) {
      fetchProductDetails();
    }
  }, [cart]);

  const fetchProductDetails = async () => {
    const productMap = {};
    for (const item of cart.items) {
      try {
        const response = await axios.get(`${API}/products/${item.product_id}`);
        productMap[item.product_id] = response.data;
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }
    setProducts(productMap);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-24 px-6 md:px-12 lg:px-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-4xl font-semibold tracking-tight text-charcoal mb-6" data-testid="empty-cart-title">
            Your cart is empty
          </h1>
          <p className="font-manrope text-base text-text-secondary mb-8">
            Start your matcha journey today.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-charcoal text-white hover:bg-matcha-green rounded-full px-8 py-4 transition-all duration-500 ease-out text-sm uppercase tracking-widest font-manrope"
            data-testid="shop-now-from-cart-button"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-playfair text-5xl font-semibold tracking-tight text-charcoal mb-12"
          data-testid="cart-title"
        >
          Your Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => {
              const product = products[item.product_id];
              if (!product) return null;

              return (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border border-[#E5E5E5] p-6 flex space-x-6"
                  data-testid={`cart-item-${item.product_id}`}
                >
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-playfair text-xl font-semibold text-charcoal mb-2">
                      {product.name}
                    </h3>
                    <p className="font-manrope text-sm text-text-secondary mb-4">
                      ₹{item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 border border-charcoal flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors duration-300"
                          data-testid={`decrease-cart-quantity-${item.product_id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-manrope text-sm font-medium w-8 text-center" data-testid={`cart-item-quantity-${item.product_id}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 border border-charcoal flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors duration-300"
                          data-testid={`increase-cart-quantity-${item.product_id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.product_id)}
                        className="text-text-muted hover:text-charcoal transition-colors duration-300"
                        data-testid={`remove-cart-item-${item.product_id}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-stone-secondary p-8 border border-[#E5E5E5] sticky top-32"
              data-testid="order-summary"
            >
              <h2 className="font-playfair text-2xl font-semibold text-charcoal mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between font-manrope text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-charcoal font-medium" data-testid="cart-subtotal">
                    ₹{getCartTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-manrope text-sm">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="text-charcoal font-medium">Free</span>
                </div>
                <div className="border-t border-[#E5E5E5] pt-4 flex justify-between font-manrope text-lg">
                  <span className="text-charcoal font-semibold">Total</span>
                  <span className="text-charcoal font-semibold" data-testid="cart-total">
                    ₹{getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-charcoal text-white hover:bg-matcha-green rounded-full px-8 py-4 transition-all duration-500 ease-out text-sm uppercase tracking-widest font-manrope"
                data-testid="proceed-to-checkout-button"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full mt-4 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white rounded-full px-8 py-4 transition-all duration-300 text-sm uppercase tracking-widest font-manrope"
                data-testid="continue-shopping-button"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
