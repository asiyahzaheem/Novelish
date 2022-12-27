const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');

const bookRouter = require('./routers/bookRouter');
const userRouter = require('./routers/userRouter');
const purchaseRouter = require('./routers/purchaseRouter');
const reviewRouter = require('./routers/reviewRouter');
const viewRouter = require('./routers/viewRouter');
const cartRouter = require('./routers/cartRouter');
const globalErrorHandling = require('./controllers/errorController');
const AppError = require('./utils/appError');
const purchaseController = require('./controllers/purchaseController');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, 'public')));

const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://js.stripe.com/v3/',
];
const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
  'https://js.stripe.com/v3/',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https://js.stripe.com/v3/'],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);
// app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this IP. Please try again in an hour',
});

app.use('/api', limiter);

// we need this object to be in raw string form and not json
app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  purchaseController.webhookCheckout
);

// get data from req.body // converts body to json
app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'ratingsAverage',
      'ratingsQuantity',
      'pageCount',
      'genre',
      'price',
    ],
  })
);

app.use(compression());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use('/', viewRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/purchases', purchaseRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/cart', cartRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 400));
});

app.use(globalErrorHandling);
module.exports = app;
