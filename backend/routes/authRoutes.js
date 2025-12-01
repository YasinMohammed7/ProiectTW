const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');

router.route('/google').post(loginLimiter, authController.googleLoginController);
router.route('/refresh').get(authController.refresh);
router.route('/logout').post(authController.logout);
module.exports = router;