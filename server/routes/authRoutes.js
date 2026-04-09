const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validationMiddleware');

router.post(
  '/signup',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  validate,
  signup
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  validate,
  login
);

router.get('/me', protect, getMe);

module.exports = router;
