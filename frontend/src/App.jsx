// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, ProtectedContent, GuestContent } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import { Toaster } from 'react-hot-toast';

// Pages and Components
import Home from './pages/Home';
import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import { Login, Register } from './components/auth';

const App = () => {
  // Remove loader on mount
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 300);
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Guest Routes */}
            <Route path="/login" element={
              <GuestContent fallback={<Navigate to="/" />}>
                <Login />
              </GuestContent>
            } />
            <Route path="/register" element={
              <GuestContent fallback={<Navigate to="/" />}>
                <Register />
              </GuestContent>
            } />
            
            {/* Protected Routes */}
            <Route path="/checkout" element={
              <ProtectedContent fallback={<Navigate to="/login" />}>
                <Checkout />
              </ProtectedContent>
            } />
          </Routes>
        </Layout>

        {/* Toast notifications */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#4F46E5',
              },
            },
            error: {
              duration: 3000,
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;