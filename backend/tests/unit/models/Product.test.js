import Product from '../../../src/models/Product';

describe('Product Model', () => {
  it('validates required fields', async () => {
    try {
      await Product.create({});
      fail('Should have thrown validation error');
    } catch (error) {
      expect(error.errors.name).toBeDefined();
      expect(error.errors.description).toBeDefined();
      expect(error.errors.price).toBeDefined();
      expect(error.errors.category).toBeDefined();
    }
  });

  it('validates price is positive', async () => {
    try {
      await Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: -10,
        category: 'toys',
        imageUrl: '/test.jpg',
        stock: 10,
      });
      fail('Should have thrown validation error');
    } catch (error) {
      expect(error.errors.price).toBeDefined();
    }
  });
});