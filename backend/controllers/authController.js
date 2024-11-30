const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getUserById = async (req, res) => {
    const { userId } = req.params; // Get userId from the route parameter
    try {
        // Fetch user details by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send user details in the response
        res.status(200).json({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, isAdmin } = req.body;
    const userIsAdmin = isAdmin === undefined ? false : isAdmin;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the given `firstName`, `lastName`, and `isAdmin`
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isAdmin: userIsAdmin,
        });

        await newUser.save();

        // Generate a JWT token for the new user
        const token = jwt.sign(
            { id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, isAdmin: newUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token: token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
