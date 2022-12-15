const mongoose = require('mongoose');
const slugify = require('slugify');
const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A book must have a name!'],
      unique: true,
      trim: true,
    },
    slug: String,
    author: {
      type: String,
      required: [true, 'A book must have an author!'],
    },
    pageCount: Number,
    description: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'A book must have a summary!'],
      trim: true,
    },
    ISBN: {
      type: Number,
      required: [true, 'A book must have an ISBN number!'],
    },
    genre: [
      {
        type: String,
        required: [true, 'A book must belong to a series of genres!'],
      },
    ],
    image: String,
    price: {
      type: Number,
      required: [true, 'A book must have a price!'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be >= 1 and <= 5'],
      max: [5, 'Ratings must be >= 1 and <= 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.index({ price: 1, ratingsAverage: -1 });
bookSchema.index({ genre: 1 });
bookSchema.index({ slug: 1 });

bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id',
});

bookSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
