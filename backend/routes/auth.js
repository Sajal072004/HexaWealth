const express = require('express');
const { signup, login, getUserById , getAllUsers } = require('../controllers/authController');
const router = express.Router();

// User signup route
router.post('/signup', signup);

// User login route
router.post('/login', login);

// Get user details by userId
router.get('/user/:userId', getUserById); // No token verification, direct user fetch based on userId

router.get('/dummy' , getAllUsers);

module.exports = router;
