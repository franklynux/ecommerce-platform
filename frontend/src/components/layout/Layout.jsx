// src/components/layout/Layout.jsx
import React from 'react';
import Header from './Header';  // This matches the Header export
import Footer from './Footer';  // Make sure Footer is also exported as default

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;