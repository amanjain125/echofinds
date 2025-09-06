// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Our Product model
const auth = require('../middleware/authMiddleware'); // Our auth middleware

// @route   POST api/products
// @desc    Create a new product listing
// @access  Private (only logged-in users can create listings)
router.post('/', auth, async (req, res) => {
  const { title, description, category, price, imageUrl } = req.body; // Get data from request body
  try {
    const newProduct = new Product({
      title,
      description,
      category,
      price,
      imageUrl,
      seller: req.user.id, // The seller is the logged-in user
    });
    const product = await newProduct.save(); // Save to database
    res.status(201).json(product); // 201 Created
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: errors.join(', ') });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products
// @desc    Get all product listings (with optional category filter and search)
// @access  Public (anyone can view products)
router.get('/', async (req, res) => {
  const { category, search, seller } = req.query; // Get filter/search terms from query parameters
  let filter = {};

  // Category filtering
  if (category && category !== 'All') {
    filter.category = category;
  }

  // Keyword search in title
  if (search) {
    filter.title = { $regex: new RegExp(search, 'i') }; // Case-insensitive regex search
  }

  // Filter by seller (e.g., for "My Listings" page)
  if (seller) {
    filter.seller = seller;
  }

  try {
    // Find products matching the filter, and populate seller's username
    const products = await Product.find(filter)
                                  .populate('seller', ['username', 'email']) // Only get username and email from seller
                                  .sort({ createdAt: -1 }); // Sort by newest first
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/:id
// @desc    Get a single product by its ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
                                  .populate('seller', ['username', 'email']);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    // Handle case where ID format is invalid (e.g., not a valid MongoDB ObjectId)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/products/:id
// @desc    Update an existing product listing
// @access  Private (only the seller can update their own product)
router.put('/:id', auth, async (req, res) => {
  const { title, description, category, price, imageUrl } = req.body;
  // Build an object with the fields that are allowed to be updated
  const productFields = { title, description, category, price, imageUrl };

  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if the logged-in user is the actual seller of the product
    // product.seller is an ObjectId, req.user.id is a string, so convert one to string
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to update this product' });
    }

    // Find and update the product, returning the updated document
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields }, // Use $set to update specific fields
      { new: true, runValidators: true } // `new: true` returns the updated doc; `runValidators` ensures schema validators run on update
    );
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: errors.join(', ') });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product listing
// @access  Private (only the seller can delete their own product)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if the logged-in user is the actual seller
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this product' });
    }

    await Product.findByIdAndRemove(req.params.id); // Delete the product
    res.json({ msg: 'Product removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;