const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // Necesitas esta para crear tu cuenta
router.post('/login', authController.login);

module.exports = router;