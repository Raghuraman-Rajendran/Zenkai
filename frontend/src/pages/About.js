import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center" data-testid="about-hero">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1770178995778-c6341164de63?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHplbiUyMGdhcmRlbiUyMHN0b25lJTIwbWluaW1hbGlzbXxlbnwwfHx8fDE3NzEwNjcyMzl8MA&ixlib=rb-4.1.0&q=85"
            alt="Zen Garden"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-white/95 via-stone-white/80 to-transparent" />
        </div>
        
        <div className="relative px-6 md:px-12 lg:px-24 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-playfair text-5xl md:text-6xl font-semibold tracking-tight text-charcoal"
            data-testid="about-title"
          >
            Our Story
          </motion.h1>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24" data-testid="brand-story">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 font-manrope text-base md:text-lg text-text-secondary leading-relaxed">
            <p>
              Zenkai Matcha was born from a simple belief: that ancient wisdom and modern wellness can
              coexist. Our founder, inspired by a transformative trip to Uji, Japan, discovered the
              profound ritual of matcha preparation and its ability to bring clarity, calm, and focus
              to even the busiest days.
            </p>
            <p>
              Today, we partner directly with fifth-generation tea farmers in Uji to source the finest
              ceremonial-grade matcha. Every tin of Zenkai represents centuries of tradition, expertise,
              and dedication to quality.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-stone-secondary" data-testid="values-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-16 text-center">
            What We Stand For
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-matcha-green/10 rounded-full mb-6">
                <Leaf className="w-10 h-10 text-matcha-green" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold mb-4">Sustainability</h3>
              <p className="font-manrope text-sm text-text-secondary">
                We use fully compostable packaging and carbon-neutral shipping. Our tea gardens follow
                organic, pesticide-free practices that protect the soil for future generations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-matcha-green/10 rounded-full mb-6">
                <Heart className="w-10 h-10 text-matcha-green" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold mb-4">Transparency</h3>
              <p className="font-manrope text-sm text-text-secondary">
                Every batch is traceable to the exact farm and harvest date. We believe you deserve to
                know where your matcha comes from and how it's made.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-matcha-green/10 rounded-full mb-6">
                <Globe className="w-10 h-10 text-matcha-green" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold mb-4">Fair Trade</h3>
              <p className="font-manrope text-sm text-text-secondary">
                We pay above fair trade prices to our partner farmers, ensuring their craft is honored
                and their communities thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24" data-testid="sourcing-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-8">
                From Uji to You
              </h2>
              <p className="font-manrope text-base text-text-secondary mb-6 leading-relaxed">
                Uji, Japan has been the epicenter of premium matcha production for over 800 years.
                The region's unique climate, mineral-rich soil, and morning mist create ideal conditions
                for growing the finest tea leaves.
              </p>
              <p className="font-manrope text-base text-text-secondary leading-relaxed">
                Our matcha is shade-grown for 3-4 weeks before harvest, stone-ground in small batches,
                and shipped directly to India to preserve its vibrant color, fresh taste, and maximum
                nutritional benefits.
              </p>
            </div>
            
            <div>
              <img
                src="https://images.unsplash.com/photo-1766485586335-b3ecea463aa6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwzfHxncmVlbiUyMHRlYSUyMHBsYW50YXRpb24lMjBmb2d8ZW58MHx8fHwxNzcxMDY3MjM3fDA&ixlib=rb-4.1.0&q=85"
                alt="Tea Plantation"
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
