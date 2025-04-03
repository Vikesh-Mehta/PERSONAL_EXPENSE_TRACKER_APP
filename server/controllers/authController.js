// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in User model
    });

    // Create token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { // Send back basic user info (without password)
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during registration' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password'); // Need to explicitly select password

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' }); // Use generic message for security
    }

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { // Send back basic user info (without password)
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during login' });
  }
};


// @desc    Get current logged in user (Example of protected route)
// @route   GET /api/auth/me
// @access  Private (Requires token)
exports.getMe = async (req, res, next) => {
    // req.user is set by the authMiddleware
    try {
        // We don't need to fetch again if middleware attaches user object
        // const user = await User.findById(req.user.id);
        if (!req.user) {
             return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: req.user // Send user data attached by middleware
        });
    } catch (error) {
        console.error("GetMe Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};