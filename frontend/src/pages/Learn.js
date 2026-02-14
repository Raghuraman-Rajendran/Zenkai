import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Learn = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API}/blog`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-playfair text-5xl md:text-6xl font-semibold tracking-tight text-charcoal mb-6" data-testid="learn-title">
            Learn About Matcha
          </h1>
          <p className="font-manrope text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
            Discover the science, tradition, and wellness benefits of ceremonial-grade matcha.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12" data-testid="blog-posts-grid">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
              data-testid={`blog-post-${post.slug}`}
            >
              <div className="bg-white border border-[#E5E5E5] overflow-hidden mb-6 image-zoom-container">
                <div className="aspect-[4/3]">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover image-zoom"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <span className="font-manrope text-xs uppercase tracking-widest text-text-muted">
                  {post.category}
                </span>
              </div>
              
              <h2 className="font-playfair text-2xl font-semibold tracking-tight text-charcoal mb-4">
                {post.title}
              </h2>
              
              <p className="font-manrope text-sm text-text-secondary mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              
              <Link
                to={`/learn/${post.slug}`}
                className="inline-flex items-center space-x-2 text-charcoal border-b border-charcoal pb-1 hover:border-transparent transition-all font-manrope text-sm uppercase tracking-widest"
              >
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;
