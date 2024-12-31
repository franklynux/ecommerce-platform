import Product from '../../models/Product';
import { formatResponse } from '../../utils/responseFormatter';

export const productController = {
  // List and Search Methods
  async getProducts(req, res, next) {
    try {
      const { category, sort, limit = 10, page = 1 } = req.query;
      const query = category ? { category } : {};
      
      const sortOptions = sort ? {
        [sort.split(':')[0]]: sort.split(':')[1] === 'desc' ? -1 : 1
      } : {};

      const skip = (page - 1) * limit;
      
      const [products, total] = await Promise.all([
        Product.find(query)
          .sort(sortOptions)
          .limit(parseInt(limit))
          .skip(skip),
        Product.countDocuments(query)
      ]);
      
      res.json(formatResponse('success', {
        products,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }));
    } catch (error) {
      next(error);
    }
  },

  async searchProducts(req, res, next) {
    try {
      const { query = '', page = 1, limit = 10 } = req.query;
      const searchRegex = new RegExp(query, 'i');

      const [products, total] = await Promise.all([
        Product.find({
          $or: [
            { name: searchRegex },
            { description: searchRegex }
          ]
        })
          .limit(parseInt(limit))
          .skip((page - 1) * limit),
        Product.countDocuments({
          $or: [
            { name: searchRegex },
            { description: searchRegex }
          ]
        })
      ]);

      res.json(formatResponse('success', {
        products,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }));
    } catch (error) {
      next(error);
    }
  },

  async getCategories(req, res, next) {
    try {
      const categories = await Product.distinct('category');
      res.json(formatResponse('success', categories));
    } catch (error) {
      next(error);
    }
  },

  // Individual Product Methods
  async getProductById(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json(
          formatResponse('error', null, 'Product not found')
        );
      }
      res.json(formatResponse('success', product));
    } catch (error) {
      next(error);
    }
  },

  async createProduct(req, res, next) {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(
        formatResponse('success', product, 'Product created successfully')
      );
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req, res, next) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!product) {
        return res.status(404).json(
          formatResponse('error', null, 'Product not found')
        );
      }
      res.json(formatResponse('success', product, 'Product updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json(
          formatResponse('error', null, 'Product not found')
        );
      }
      res.json(formatResponse('success', null, 'Product deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};