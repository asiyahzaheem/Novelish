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
  // const userId = await User.findOne({ email: req.user.email });
  const customer = await stripe.customers.create({
    metadata: { cart: JSON.stringify(req.body.cart) },
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    mode: 'payment',
    // client_reference_id: req.params.bookId,
    customer: customer.id,
    line_items: Object.values(req.body.cart.items).map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.item.name,
            description: item.item.id,
            images: [
              `${req.protocol}://${req.get('host')}/img/books/${
                item.item.image
              }`,
            ],
          },
          unit_amount: item.item.price * 100,
        },
        quantity: item.qty,
      };
    }),
  });
  // send
  console.log(session);
  res.status(200).json({
    status: 'success',
    session,
  });
});

const createBookingCheckout = async (customer, data) => {
  // const books = [];
  // session.display_items.forEach((item) =>
  //   books.append(item.price_data.product_data.description)
  // );
  // console.log('session');
  // console.log(session);
  // console.log('books');
  // console.log(books);
  // const user = await User.findOne({ email: session.customer_email });
  // let price = 0;
  // session.display_items.forEach(
  //   (item) => (price = price + item.price_data.unit_amount / 100)
  // );
  // console.log('price');
  // console.log(price);
  const cart = JSON.parse(customer.metadata.cart);
  const books = Object.keys(cart.items);
  const price = cart.totalPrice.toFixed(2);
  const user = await User.findOne({ email: data.customer_email });
  // const books = ['6373ac45326b57646c68f734'];
  // const price = 10.99;
  // const user = JSON.parse(customer.metadata.userId);
  await Purchase.create({ books, user, price });
};

exports.webhookCheckout = (req, res, next) => {
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
  if (event.type === 'checkout.session.completed') {
    stripe.customers
      .retrieve(event.data.object.customer)
      .then((customer) => {
        createBookingCheckout(customer, event.data.object);
      })
      .catch((err) => console.log(err.message));
  }
  res.status(200).json({ received: true });
};
