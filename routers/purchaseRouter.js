const express = require('express');

const authController = require('../controllers/authController');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();

router.use(authController.protect);

router.post('/checkout-session', purchaseController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'seller'));
router
  .route('/')
  .post(purchaseController.createPurchase)
  .get(purchaseController.getAllPurchases);

router
  .route('/:id')
  .get(purchaseController.getPurchase)
  .patch(purchaseController.updatePurchase)
  .delete(purchaseController.deletePurchase);
module.exports = router;
