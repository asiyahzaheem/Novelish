const Purchase = require('../models/purchaseModel');
const Book = require('../models/bookModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');
const stripe = require('stripe')(
  'sk_test_51MCPfyEHSvBhKikvA5xJHUzGCm5yt8iA6yzgmPYXY14ufGtPSLB9HBqwD8apdPmjnMutalCh7fQY9whSWMfrU1Xc00SpkdLxLM'
);

exports.createPurchase = factory.createOne(Purchase);
exports.getAllPurchases = factory.getAll(Purchase);
exports.updatePurchase = factory.updateOne(Purchase);
exports.getPurchase = factory.getOne(Purchase);
exports.deletePurchase = factory.deleteOne(Purchase);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
    customer_email: req.user.customer,
    mode: 'payment',
    // client_reference_id: req.params.bookId,
    line_items: Object.values(req.body.cart.items).map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.item.name,
            // description: item.item,
            images: ['https://www.natours.dev/img/tours/tour-1-cover.jpg'],
          },
          unit_amount: item.item.price * 100,
        },
        quantity: item.qty,
      };
    }),
  });
  // send
  res.status(200).json({
    status: 'success',
    session,
  });
});
