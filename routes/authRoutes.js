const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;


// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '3h' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Login échoué' });
});

// Middleware auth
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
}

// Route protégée
router.get('/admin-data', authenticateToken, (req, res) => {
  res.json({
    message: 'Contenu admin sécurisé',
    user: req.user,
  });
});

module.exports = router;  // ✅ export correct
