import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51MCPfyEHSvBhKikvOJLQLxN9XetxOMZtkujO0g2T8A7NIeSGJcseT0Enq36T5HERP3GGG4tUAqSbyljqn6sPiHb600CdDtlj2O'
);

// export const purchaseBooks = ()
export const purchase = async (cart) => {
  try {
    const session = await axios({
      method: 'post',
      url: 'http://127.0.0.1:5000/api/v1/purchases/checkout-session',
      data: { cart },
    });
    console.log(session);
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err.response.data);
    showAlert('error', err);
  }
};
