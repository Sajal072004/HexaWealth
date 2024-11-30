const express = require('express');
const { signup, login, getUserById } = require('../controllers/authController');
const router = express.Router();

// User signup route
router.post('/signup', signup);

// User login route
router.post('/login', login);

// Get user details by userId
router.get('/user/:userId', getUserById); // No token verification, direct user fetch based on userId

module.exports = router;
