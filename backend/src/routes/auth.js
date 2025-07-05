const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Ruta de login
router.post('/login', AuthController.login);

// Ruta de registro (para prototipo)
router.post('/register', AuthController.register);

// Ruta para verificar token
router.get('/verify', AuthController.verifyToken);

// Ruta de logout
router.post('/logout', verifyToken, AuthController.logout);

module.exports = router;
