import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const Navbar = () => {
  const { items, total } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src="/logo.svg" alt="Pet Shop" />
              <span className="ml-2 font-bold text-xl text-gray-800">Pet Shop</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600"
              >
                Products
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Cart and User */}
          <div className="flex items-center">
            {/* Cart Button */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {items.length}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-3">Shopping Cart</h3>
                    {items.length === 0 ? (
                      <p className="text-gray-500">Your cart is empty</p>
                    ) : (
                      <>
                        <div className="max-h-60 overflow-y-auto">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center py-2 border-b">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="h-12 w-12 object-cover rounded"
                              />
                              <div className="ml-3 flex-1">
                                <h4 className="text-sm font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-500">
                                  ${item.price} x {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between mb-4">
                            <span className="font-semibold">Total:</span>
                            <span className="font-semibold">${total.toFixed(2)}</span>
                          </div>
                          <Link
                            to="/checkout"
                            className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700"
                          >
                            Checkout
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="ml-4">
              <button className="p-2 text-gray-600 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;