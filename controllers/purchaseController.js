const Purchase = require('../models/purchaseModel');
const Book = require('../models/bookModel');
const User = require('../models/userModel');
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
    success_url: `${req.protocol}://${req.get('host')}/my-orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.customer,
    mode: 'payment',
    // client_reference_id: req.params.bookId,
    line_items: Object.values(req.body.cart.items).map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.item.name,
            description: item.item.id,
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

const createBookingCheckout = async (session) => {
  const books = [];
  session.line_items.forEach((item) =>
    books.append(item.price_data.product_data.description)
  );
  console.log('session');
  console.log(session);
  console.log('books');
  console.log(books);
  const user = await User.findOne({ email: session.customer_email });
  let price = 0;
  session.line_items.forEach(
    (item) => (price = price + item.price_data.unit_amount / 100)
  );
  console.log('price');
  console.log(price);
  await Purchase.create({ books, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  console.log('webhook-checkout');
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  console.log(event.data.object);
  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);
  res.status(200).json({ received: 'true ' });
};
