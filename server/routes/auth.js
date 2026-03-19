const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login } = require('../controllers/authController');

router.post('/signup', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], signup);

router.post('/login', login);

module.exports = router;
