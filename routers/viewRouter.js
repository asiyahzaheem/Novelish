const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/book/:slug', authController.isLoggedIn, viewController.getBook);
router.get('/books', authController.isLoggedIn, viewController.getBooks);
router.post('/getCart', authController.protect, viewController.cart);
router.get('/cart', authController.protect, viewController.getCart);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getMe);
router.get('/my-orders', authController.protect, viewController.getMyOrders);
router.get(
  '/resetPassword/:token',
  authController.isLoggedIn,
  viewController.getResetPwForm
);
module.exports = router;
