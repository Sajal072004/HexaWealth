const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request object
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const adminMiddleware = (req, res, next) => {
    // console.log(req.user);
    // if (!req.user.isAdmin) return res.status(403).json({ error: 'Access denied. Admins only.' });
    next();
};


module.exports = { authMiddleware, adminMiddleware };
