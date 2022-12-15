const catchAsync = require('../utils/catchAsync');
const Book = require('../models/bookModel');
const Purchases = require('../models/purchaseModel');

const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).render('overview', {
    title: 'Welcome!',
    books,
  });
});

exports.getBooks = catchAsync(async (req, res, next) => {
  let books;
  console.log(req.query);
  if (req.query) {
    books = await Book.find();
  } else {
    books = await Book.find();
  }
  res.status(200).render('books', {
    title: 'Welcome!',
    books,
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!book) return next(new AppError('There is no book with that name!', 404));
  res.status(200).render('book', {
    title: `${book.name}`,
    book,
  });
});

let cartVal;
exports.cart = catchAsync(async (req, res, next) => {
  cartVal = req.body.cart;
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = cartVal;

  res.status(200).render('cart', {
    title: 'My cart',
    cart,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login to your account',
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Login to your account',
  });
});

exports.getResetPwForm = catchAsync(async (req, res, next) => {
  res.status(200).render('resetPassword', {
    title: 'Reset your password',
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const purchases = await Purchases.find({ user: req.user.id });
  console.log(purchases);
  console.log(purchases[0]);
  console.log(purchases[0].books);
  res.status(200).render('myOrders', {
    title: 'My Orders',
    purchases,
  });
});
