// src/components/products/ProductList.jsx
import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

const products = [
  {
    id: 1,
    name: 'Bird Cage Deluxe',
    description: 'Spacious cage with multiple perches and feeding stations.',
    price: 129.99,
    category: 'Habitats',
    imageUrl: '/api/placeholder/400/300',
  },
  {
    id: 2,
    name: 'Automatic Pet Feeder',
    description: 'Programmable feeder with portion control and voice recording.',
    price: 79.99,
    category: 'Feeding',
    imageUrl: '/api/placeholder/400/300',
  },
  {
    id: 3,
    name: 'Deluxe Dog Bed',
    description: 'Memory foam pet bed with removable washable cover, perfect for all sizes.',
    price: 59.99,
    category: 'Bedding',
    imageUrl: '/api/placeholder/400/300',
  },
  // Add more products as needed
];

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    
    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 h-20">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isAdded 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <CheckIcon className="h-5 w-5" />
                Added
              </>
            ) : (
              <>
                <ShoppingCartIcon className="h-5 w-5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'All Products',
    'Bedding',
    'Toys',
    'Accessories',
    'Grooming',
    'Feeding',
    'Habitats'
  ];

  const filteredProducts = products.filter(product => 
    selectedCategory === 'All Products' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // featured
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Products</h1>
        <p className="text-gray-600">Browse our selection of premium pet products</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;