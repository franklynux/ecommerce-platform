import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../../hooks/useCart';
import ProductImageGallery from './ProductImageGallery';

// Mock product with proper image structure
const getMockProduct = (id) => ({
  id: parseInt(id),
  name: "Premium Pet Bed",
  description: "Luxury memory foam pet bed designed for maximum comfort. Features a removable, washable cover and orthopedic support perfect for pets of all sizes. The non-slip base ensures stability, while the raised edges provide head and neck support.",
  price: 79.99,
  category: "bedding",
  stock: 15,
  rating: 4.8,
  reviews: 156,
  images: [
    {
      original: "https://via.placeholder.com/800x600/eef2ff/2563eb?text=Pet+Bed+Main",
      thumbnail: "https://via.placeholder.com/150x150/eef2ff/2563eb?text=1",
      alt: "Premium Pet Bed - Main View"
    },
    {
      original: "https://via.placeholder.com/800x600/eef2ff/2563eb?text=Pet+Bed+Side",
      thumbnail: "https://via.placeholder.com/150x150/eef2ff/2563eb?text=2",
      alt: "Premium Pet Bed - Side View"
    },
    {
      original: "https://via.placeholder.com/800x600/eef2ff/2563eb?text=Pet+Bed+Detail",
      thumbnail: "https://via.placeholder.com/150x150/eef2ff/2563eb?text=3",
      alt: "Premium Pet Bed - Detail View"
    },
    {
      original: "https://via.placeholder.com/800x600/eef2ff/2563eb?text=Pet+Bed+Usage",
      thumbnail: "https://via.placeholder.com/150x150/eef2ff/2563eb?text=4",
      alt: "Premium Pet Bed - In Use"
    }
  ],
  features: [
    "Memory foam construction for superior comfort",
    "Machine washable, removable cover",
    "Non-slip base for stability",
    "Water-resistant liner",
    "Available in multiple sizes",
    "Orthopedic support for aging pets"
  ],
  specifications: {
    "Materials": "Memory Foam, Premium Fabric",
    "Dimensions": "36\" x 28\" x 9\" (Large)",
    "Cover": "Machine Washable",
    "Colors": "Gray, Brown, Blue",
    "Weight Capacity": "Up to 100 lbs",
    "Warranty": "1 Year Limited"
  }
});

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Fetch product data
  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockProduct(id));
      }, 1000);
    })
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading product: {error.message}</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
    // Here you would typically show a success toast notification
    alert('Added to cart!'); // Replace with proper toast notification
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-blue-600">
              Home
            </button>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <button onClick={() => navigate('/products')} className="text-gray-500 hover:text-blue-600">
              Products
            </button>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li className="text-blue-600">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div>
          <ProductImageGallery images={product.images} />
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="sr-only">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="rounded-md border-gray-300 py-1.5"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                    disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Key Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-200 py-2">
                  <dt className="font-medium text-gray-600">{key}</dt>
                  <dd className="text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;