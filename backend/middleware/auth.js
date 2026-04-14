const jwt = require('jsonwebtoken');

// Default user for "no login required" mode
const DEFAULT_USER = {
  id: 1,
  name: 'Aryan Mittal',
  email: 'aryan@amazonclone.com'
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Allow default user access without token
    req.user = DEFAULT_USER;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'amazon_clone_secret', (err, user) => {
    if (err) {
      req.user = DEFAULT_USER;
      return next();
    }
    req.user = user;
    next();
  });
};

const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'amazon_clone_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken, requireAuth };
