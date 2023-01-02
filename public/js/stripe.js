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
      url: '/api/v1/purchases/checkout-session',
      data: { cart },
      headers: {
        'Content-type': 'application/json'
      }
    });

    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    showAlert('error', err);
    console.log(err);
  }
};
