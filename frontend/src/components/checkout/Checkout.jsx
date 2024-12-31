import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
/*import { PaymentForm } from '../payment/PaymentForm';*/

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [step, setStep] = useState('details');

  const handleDetailsSubmit = async (shippingDetails) => {
    try {
      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          shippingDetails,
        }),
      });

      const { data } = await response.json();
      setOrderId(data.orderId);
      setStep('payment');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setStep('confirmation');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {step === 'details' && (
        <CheckoutForm onSubmit={handleDetailsSubmit} />
      )}

      {step === 'payment' && orderId && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
            <p className="text-gray-600">Total: {getCartTotal()}</p>
          </div>

          <PaymentForm
            orderId={orderId}
            onSuccess={handlePaymentSuccess}
            onError={(error) => console.error('Payment error:', error)}
          />
        </div>
      )}

      {step === 'confirmation' && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Order Confirmed!</h2>
          <p>Thank you for your purchase. Your order has been placed successfully.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;