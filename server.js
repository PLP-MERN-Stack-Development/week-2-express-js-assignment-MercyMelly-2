// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
dotenv = require('dotenv');
// Custom error classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Task 3: Middleware Implementation
// - JSON body parser
app.use(bodyParser.json());

// - Request logging
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

// - Authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mysecrettoken') {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }
  next();
};

// Validation middleware for product creation/update
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || price == null || !category || inStock == null) {
    throw new ValidationError('All fields (name, description, price, category, inStock) are required');
  }
  next();
};

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Task 1: Express.js Setup
// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// Task 2: RESTful API Routes

// GET /api/products - Get all products with filtering, pagination, and search
app.get('/api/products', (req, res) => {
  let result = [...products];

  // Filtering by category
  if (req.query.category) {
    result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
  }

  // Search by name
  if (req.query.search) {
    const term = req.query.search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(term));
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || result.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = result.slice(start, end);

  res.json({
    page,
    limit,
    total: result.length,
    data: paginated
  });
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', authenticate, validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', authenticate, validateProduct, (req, res, next) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1) return next(new NotFoundError('Product not found'));

  const { name, description, price, category, inStock } = req.body;
  const updatedProduct = {
    id: productId,
    name,
    description,
    price,
    category,
    inStock
  };

  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authenticate, (req, res, next) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1) return next(new NotFoundError('Product not found'));

  const deletedProduct = products.splice(productIndex, 1);
  res.json({ message: 'Product deleted', product: deletedProduct[0] });
});

// Task 5: Advanced Feature - Product statistics
app.get('/api/products/stats/category-count', (req, res) => {
  const stats = {};
  for (const product of products) {
    stats[product.category] = (stats[product.category] || 0) + 1;
  }
  res.json({ stats });
});

// Task 4: Error Handling
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
