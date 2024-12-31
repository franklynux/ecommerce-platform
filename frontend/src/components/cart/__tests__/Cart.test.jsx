import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../tests/utils/test-utils';
import Cart from '../Cart';

describe('Cart', () => {
  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    price: 10.99,
    quantity: 1
  };

  it('shows empty cart message when no items', () => {
    renderWithProviders(<Cart />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('displays cart items and total', async () => {
    renderWithProviders(<Cart />, {
      initialCartItems: [{
        product: mockProduct,
        quantity: 1
      }]
    });

    await waitFor(() => {
      // Use a more flexible query
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
      expect(screen.getByText('$10.99')).toBeInTheDocument();
    });
  });

  it('allows removing items from cart', async () => {
    renderWithProviders(<Cart />, {
      initialCartItems: [{
        product: mockProduct,
        quantity: 1
      }]
    });

    // Use getByRole with a more specific query
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });
});