const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.use(authController.restrictTo('user'));

router.get('/add/:id', cartController.addToCart);
router.post('/addW', cartController.addToCartW);
router.get('/remove/:id', cartController.removeFromCart);
router.post('/removeW', cartController.removeFromCartW);

module.exports = router;

// function (req, res) {
//   const id = req.params.id;
//   Book.findById(id, function (err, b) {
//     if (err) console.log(err);

//     if (!req.session.cart) {
//       req.session.cart = {
//         items: {},
//         totalQty: 0,
//         totalPrice: 0,
//       };
//       req.session.cart.items[id] = {
//         name: b.name,
//         author: b.author,
//         image: b.image,
//         qty: 1,
//         price: b.price,
//       };
//       req.session.cart.totalQty = 1;
//       req.session.cart.totalPrice = b.price;
//     } else {
//       const cart = req.session.cart;
//       // book alr exists
//       if (cart.items[id]) {
//         cart.items[id].qty++;
//         cart.items[id].price = b.price * cart.items[id].qty;
//       } else {
//         req.session.cart.items[id] = {
//           name: b.name,
//           author: b.author,
//           image: b.image,
//           qty: 1,
//           price: b.price,
//         };
//       }
//       cart.totalQty++;
//       cart.totalPrice = cart.totalPrice + b.price;
//     }
//     console.log(req.session.cart);
//     res.redirect('/');
//   });
// }
