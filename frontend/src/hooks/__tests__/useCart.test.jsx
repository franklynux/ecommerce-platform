import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCart } from '../useCart';
import { CartContext, CartProvider } from '../../contexts/CartContext';
import { BrowserRouter } from 'react-router-dom';

describe('useCart', () => {
  const wrapper = ({ children, initialItems = [] }) => (
    <BrowserRouter>
      <CartProvider initialItems={initialItems}>
        {children}
      </CartProvider>
    </BrowserRouter>
  );

  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    price: 10
  };

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { 
      wrapper: ({ children }) => wrapper({ children }) 
    });

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product._id).toBe(mockProduct._id);
  });

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => wrapper({ 
        children,
        initialItems: [{ product: mockProduct, quantity: 2 }]
      })
    });

    expect(result.current.getCartTotal()).toBe(20);
  });
});

// Make sure your Cart component has this structure for the remove button:
{/* Cart.jsx example structure */}
/*
<button
  onClick={() => removeItem(item.product._id)}
  aria-label="Remove item"
>
  Remove
</button>
*/