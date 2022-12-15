const catchAsync = require('../utils/catchAsync');
const Book = require('../models/bookModel');
const AppError = require('../utils/appError');
const Cart = require('../utils/cart');

exports.addToCart = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId, 'name author price image');
  if (!book) {
    return next(new AppError('No book found with that ID!', 404));
  }
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  req.session.cart = cart;
  cart.add(book, bookId);
  res.status(200).json({
    status: 'success',
    items: cart.items,
    totalQuantity: cart.totalQty,
    totalPrice: Number.parseFloat(cart.totalPrice).toFixed(2),
  });
  next();
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;
  if (!(await Book.findById(bookId))) {
    return next(new AppError('No book found with that ID!', 404));
  }
  if (!req.session.cart) {
    return next(new AppError('Cart is empty!', 500));
  }
  const cart = new Cart(req.session.cart);
  cart.remove(bookId);
  req.session.cart = cart;
  res.status(200).json({
    status: 'success',
    items: cart.items,
    totalQuantity: cart.totalQty,
    totalPrice: Number.parseFloat(cart.totalPrice).toFixed(2),
  });
  next();
});

exports.addToCartW = catchAsync(async (req, res, next) => {
  let newCart;
  const bookId = req.body.bookId;
  const book = await Book.findById(bookId, 'name author price image');
  if (!book) {
    return next(new AppError('No book found with that ID!', 404));
  }
  const cart = new Cart(req.body.cart);
  newCart = cart;
  cart.add(book, bookId);
  res.status(200).json({
    status: 'success',
    newCart,
  });
  next();
});

exports.removeFromCartW = catchAsync(async (req, res, next) => {
  let newCart;
  const bookId = req.body.bookId;
  if (!(await Book.findById(bookId))) {
    return next(new AppError('No book found with that ID!', 404));
  }

  const cart = new Cart(req.body.cart);
  newCart = cart;
  if (req.body.removeAll === 'all') {
    cart.removeItem(bookId);
  } else {
    cart.remove(bookId);
  }
  res.status(200).json({
    status: 'success',
    newCart,
  });
  next();
});
