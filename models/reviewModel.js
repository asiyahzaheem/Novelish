const mongoose = require('mongoose');
const Book = require('./bookModel');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review cannot be left empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: [true, 'A review must belong to a book!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  }).populate({
    path: 'book',
    select: 'name image',
  });
  next();
});

reviewSchema.statics.calcAverageRating = async function (bookId) {
  // method on model
  const stats = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: '$book',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]); // this points to current model

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.book); // this.contrsructor = model
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); // this.r is a doc
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne does not work here as the query has already executed
  await this.r.constructor.calcAverageRating(this.r.book);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
