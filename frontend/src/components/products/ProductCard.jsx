import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <Card className="p-4" data-testid="product-card">
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">
            {formatCurrency(product.price)}
          </span>
          <Button
            onClick={() => addItem(product)}
            variant="primary"
            aria-label="Add to cart"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;