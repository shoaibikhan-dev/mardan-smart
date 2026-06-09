const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');
const User = require('../models/User');

const crypto = require('crypto');

// Helper: generate short-lived access token (15 min)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Helper: generate opaque refresh token
const generateRefreshToken = () => crypto.randomBytes(40).toString('hex');

// Helper: set both cookies
const setTokenCookies = async (res, userId) => {
  const accessToken  = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();

  const { redisClient } = require('../config/redis');
  // Store refresh token in Redis: refresh:<token> → userId, TTL 7 days
  await redisClient.set(`refresh:${refreshToken}`, String(userId), 'EX', 7 * 24 * 60 * 60);

  res.cookie('msc_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie('msc_refresh', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth/refresh', // only sent to refresh endpoint
  });

  return { accessToken, refreshToken };
};

// @desc    Register new citizen
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const { name, email, password, cnic, phone } = req.body;
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(409).json({ success: false, message: 'Email already registered' });
      
    const cnicExists = await User.findOne({ where: { cnic } });
    if (cnicExists)
      return res.status(409).json({ success: false, message: 'CNIC already registered' });

    const hashed = await bcrypt.hash(password, 12);
    
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      cnic, 
      phone,
    });

    await setTokenCookies(res, user.id);
    res.status(201).json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    logger.error({ err: error, email }, 'Register failed');
    res.status(500).json({ success: false, message: 'Registration failed. Please try again later.' });
  }
};



// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    await setTokenCookies(res, user.id);
    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    logger.error({ err, email }, 'Login failed');
    res.status(500).json({ success: false, message: 'Login failed. Please try again later.' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc    Logout (client-side token deletion)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    const { redisClient } = require('../config/redis');
    const accessToken  = req.cookies.msc_token;
    const refreshToken = req.cookies.msc_refresh;
    if (accessToken)  await redisClient.set(`blacklist:${accessToken}`, 'true', 'EX', 15 * 60);
    if (refreshToken) await redisClient.del(`refresh:${refreshToken}`);
    res.clearCookie('msc_token');
    res.clearCookie('msc_refresh', { path: '/api/v1/auth/refresh' });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public (refresh cookie required)
exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.msc_refresh;
    if (!refreshToken)
      return res.status(401).json({ success: false, message: 'No refresh token' });

    const { redisClient } = require('../config/redis');
    const userId = await redisClient.get(`refresh:${refreshToken}`);
    if (!userId)
      return res.status(401).json({ success: false, message: 'Refresh token expired or revoked' });

    // Rotate: delete old, issue new pair
    await redisClient.del(`refresh:${refreshToken}`);
    await setTokenCookies(res, userId);

    res.json({ success: true, message: 'Token refreshed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Token refresh failed' });
  }
};
