import React, { createContext, useReducer, useCallback } from 'react';

// Create context with undefined as initial value
export const CartContext = createContext(undefined);

const initialState = {
  items: []
};

// Action types
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload.product._id
      );

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [...state.items, action.payload]
      };
    }

    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.product._id !== action.payload)
      };

    case UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case CLEAR_CART:
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children, initialItems = [] }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    ...initialState,
    items: initialItems
  });

  const addItem = useCallback((product, quantity = 1) => {
    dispatch({
      type: ADD_ITEM,
      payload: { product, quantity }
    });
  }, []);

  const removeItem = useCallback((productId) => {
    dispatch({
      type: REMOVE_ITEM,
      payload: productId
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({
      type: UPDATE_QUANTITY,
      payload: { productId, quantity }
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CLEAR_CART });
  }, []);

  const getCartTotal = useCallback(() => {
    return state.items.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }, [state.items]);

  const value = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};