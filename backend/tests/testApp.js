import express from 'express';
import productRoutes from '../src/routes/products.js';

const createTestApp = () => {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/products', productRoutes);

  // Error handling
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Internal server error'
    });
  });

  return app;
};

export default createTestApp;