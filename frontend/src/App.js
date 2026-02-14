import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from './components/ui/sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Learn from './pages/Learn';
import Subscribe from './pages/Subscribe';
import OrderConfirmation from './pages/OrderConfirmation';
import '@/App.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App smooth-scroll">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:slug" element={<Learn />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          </Routes>
          <Footer />
          <WhatsAppWidget />
          <Toaster position="top-right" richColors />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
