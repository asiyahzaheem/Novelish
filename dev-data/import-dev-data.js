const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/bookModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database connection successful!');
  });

const books = JSON.parse(
  fs.readFileSync(`${__dirname}/book-data.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/user-data.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/review-data.json`, 'utf-8')
);

const importData = async () => {
  try {
    //await Book.create(books);
    await Review.create(reviews);
    //await User.create(users, { validateBeforeSave: false });
    console.log('Successfully loaded');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    //await Book.deleteMany();
    //await User.deleteMany();
    await Review.deleteMany();
    console.log('Successfully deleted');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
