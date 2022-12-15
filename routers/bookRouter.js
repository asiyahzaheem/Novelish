const express = require('express');

const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routers/reviewRouter');

const router = express.Router();

router.use('/:bookId/reviews', reviewRouter);

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    bookController.createBook
  );

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    bookController.updateBook
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    bookController.deleteBook
  );

module.exports = router;
