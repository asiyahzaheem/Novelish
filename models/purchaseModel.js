const mongoose = require('mongoose');

const User = require('../models/userModel');
const Book = require('../models/bookModel');

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A purchase must belong to a user!'],
    },
    books: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
      },
    ],
    price: {
      type: Number,
      required: [true, 'A purchase must have a price!'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

purchaseSchema.pre(/^find/, function (next) {
  this.populate('user').populate({ path: 'books', select: 'name image ISBN' });
  next();
});

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
