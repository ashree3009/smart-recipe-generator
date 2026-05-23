const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`[Auth] Attempting to register user: ${email}`);

    if (!name || !email || !password) {
      console.error('[Auth] Registration Failed: Missing required fields');
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.warn(`[Auth] Registration Failed: User ${email} already exists`);
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      console.log(`[Auth] Successfully registered user: ${user.email}`);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.error('[Auth] Registration Failed: Invalid user data returned after creation');
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error('[Auth] Registration Server Error:', error);
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`[Auth] Login attempt for: ${email}`);

    if (!email || !password) {
      console.error('[Auth] Login Failed: Missing fields');
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log(`[Auth] Login successful for: ${email}`);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.warn(`[Auth] Login Failed: Invalid credentials for ${email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[Auth] Login Server Error:', error);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
