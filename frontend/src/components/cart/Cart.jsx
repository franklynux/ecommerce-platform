import React from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

const Cart = () => {
  const { items, removeItem, getCartTotal } = useCart();

  if (items.length === 0) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div className="p-4" data-testid="cart">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.product._id} 
            className="flex justify-between items-center"
            data-testid={`cart-item-${item.product._id}`}
          >
            <div>
              <h3>{item.product.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>{formatCurrency(item.product.price * item.quantity)}</p>
            </div>
            <button
              onClick={() => removeItem(item.product._id)}
              aria-label="Remove item"
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xl font-bold">
        Total: {formatCurrency(getCartTotal())}
      </div>
    </div>
  );
};

export default Cart;