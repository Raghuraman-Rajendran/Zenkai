import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-manrope text-lg text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-manrope text-lg text-text-secondary">Product not found</p>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen py-24">
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white border border-[#E5E5E5] aspect-square" data-testid="product-image">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <div className="mb-4">
              <span className="font-manrope text-sm uppercase tracking-widest text-text-muted">
                {product.category}
              </span>
            </div>

            <h1 className="font-playfair text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-6" data-testid="product-detail-name">
              {product.name}
            </h1>

            <div className="flex items-center space-x-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating)
                        ? 'fill-matcha-green text-matcha-green'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-manrope text-sm text-text-secondary" data-testid="reviews-count">
                ({reviews.length} reviews)
              </span>
            </div>

            <p className="font-manrope text-3xl font-medium text-charcoal mb-8" data-testid="product-detail-price">
              ₹{product.price.toFixed(2)}
            </p>

            <p className="font-manrope text-base text-text-secondary mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="font-manrope text-sm uppercase tracking-widest text-charcoal mb-4">
                  Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="font-manrope text-sm text-text-secondary flex items-start">
                      <span className="text-matcha-green mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="font-manrope text-sm uppercase tracking-widest text-charcoal mb-4">
                Quantity
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-charcoal flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors duration-300"
                  data-testid="decrease-quantity-button"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-manrope text-lg font-medium w-12 text-center" data-testid="quantity-display">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-charcoal flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors duration-300"
                  data-testid="increase-quantity-button"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-charcoal text-white hover:bg-matcha-green rounded-full px-8 py-4 transition-all duration-500 ease-out text-sm uppercase tracking-widest font-manrope"
                data-testid="add-to-cart-button"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full border border-charcoal text-charcoal hover:bg-charcoal hover:text-white rounded-full px-8 py-4 transition-all duration-300 text-sm uppercase tracking-widest font-manrope"
                data-testid="buy-now-button"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-24" data-testid="reviews-section">
            <h2 className="font-playfair text-3xl font-semibold tracking-tight text-charcoal mb-12">
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-[#E5E5E5] p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-matcha-green text-matcha-green'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="font-manrope text-sm text-text-secondary mb-4">{review.comment}</p>
                  <p className="font-manrope text-sm font-medium text-charcoal">- {review.customer_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
