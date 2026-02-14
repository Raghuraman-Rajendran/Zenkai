import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
      data-testid={`product-card-${product.id}`}
    >
      <div className="bg-white border border-[#E5E5E5] overflow-hidden image-zoom-container">
        <div className="aspect-square">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover image-zoom"
          />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <h3 className="font-playfair text-xl tracking-tight text-charcoal" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="font-manrope text-sm text-text-secondary line-clamp-2">
          {product.description}
        </p>
        <p className="font-manrope text-lg font-medium text-charcoal" data-testid={`product-price-${product.id}`}>
          ₹{product.price.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
