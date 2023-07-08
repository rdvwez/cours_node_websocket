const express = require('express')
const router = express.Router();
const Validator = require('../utils/validator');

const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

router.post('/login', authMiddleware.validateLogin(Validator.login) , authController.AuthLogin)
router.post('/logout', authController.AuthLogout)

module.exports = router;