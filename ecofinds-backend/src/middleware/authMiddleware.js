// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// This is a middleware function that checks for a valid JWT in the request header
module.exports = function (req, res, next) {
  // Get token from the header (conventionally 'x-auth-token')
  const token = req.header('x-auth-token');

  // Check if no token is present
  if (!token) {
    // 401 Unauthorized status
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify the token
  try {
    // jwt.verify takes the token and the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If verified, the payload (which contains user.id) is available in decoded
    // We attach the user to the request object so subsequent middleware/routes can access it
    req.user = decoded.user;
    next(); // Move to the next middleware or route handler
  } catch (err) {
    // If token is not valid (e.g., expired, malformed)
    res.status(401).json({ msg: 'Token is not valid' });
  }
};