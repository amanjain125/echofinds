// src/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Books', 'Fashion', 'Home Goods', 'Sports', 'Other'], // Predefined categories
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    get: v => parseFloat(v.toFixed(2)), // Store prices with 2 decimal places
    set: v => parseFloat(v.toFixed(2))
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300', // Default placeholder image
    // In a real app, you'd store the actual URL after upload
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId, // This is how you reference another model (User)
    ref: 'User', // Refers to the 'User' model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);