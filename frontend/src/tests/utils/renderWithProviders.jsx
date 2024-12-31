import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../contexts/CartContext';

export const renderWithProviders = (ui, options = {}) => {
  const AllProviders = ({ children }) => (
    <BrowserRouter>
      <CartProvider>
        {children}
      </CartProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: AllProviders, ...options });
};