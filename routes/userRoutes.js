const express = require('express');
const authController = require('../controllers/authController')
const router = express.Router();
router
    .route('/signup')
    .get(authController.signup_get)
    .post(authController.signup_post);
router
    .route('/login')
    .get(authController.login_get)
    .post(authController.login_post);


router.get('/logout', authController.logout_get);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;
