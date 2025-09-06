// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Our User model
const jwt = require('jsonwebtoken');     // For creating JWTs
const auth = require('../middleware/authMiddleware'); // Our auth middleware

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public (no token needed to register)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body; // Destructure data from request body

  try {
    // 1. Check if user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // 2. Check if user with this username already exists
    user = await User.findOne({ username });
    if (user) {
        return res.status(400).json({ msg: 'Username is already taken' });
    }

    // 3. Create a new user instance
    user = new User({
      username,
      email,
      password, // Password will be hashed by the pre-save middleware in the User model
    });

    // 4. Save the user to the database
    await user.save();

    // 5. Create a JWT payload (containing user ID)
    const payload = {
      user: {
        id: user.id, // Mongoose creates an `id` virtual getter for `_id`
      },
    };

    // 6. Sign the token with the secret and set expiration
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        // Send the token and basic user info back
        res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    // Handle validation errors from Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: errors.join(', ') });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' }); // Generic message for security
    }

    // 2. Compare entered password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // 4. Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/me
// @desc    Get logged in user profile (using the token)
// @access  Private (requires a valid JWT)
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id comes from our auth middleware
    // .select('-password') prevents sending the hashed password back
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;