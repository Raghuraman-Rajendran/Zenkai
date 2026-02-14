import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory));
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'matcha', name: 'Matcha' },
    { id: 'accessories', name: 'Accessories' },
  ];

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-playfair text-5xl md:text-6xl font-semibold tracking-tight text-charcoal mb-6" data-testid="shop-title">
            Shop Zenkai
          </h1>
          <p className="font-manrope text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
            Premium ceremonial-grade matcha and authentic Japanese accessories.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16" data-testid="category-filters">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`font-manrope text-sm uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-charcoal text-white'
                  : 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
              }`}
              data-testid={`category-${category.id}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12" data-testid="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="font-manrope text-lg text-text-secondary">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
