const Book = require('../models/bookModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

const factory = require('./factoryHandler');
const AppError = require('../utils/appError');

exports.getAllBooks = factory.getAll(Book);
exports.createBook = factory.createOne(Book);
exports.getBook = factory.getOne(Book, { path: 'reviews' });
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);
