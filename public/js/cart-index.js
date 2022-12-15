import axios from 'axios';
import { showAlert } from './alerts';

export const addToCart = async (bookId, cart) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/cart/addW',
      data: { bookId, cart },
    });

    if (res.data.status === 'success') {
      showAlert('success', `Successfully added book to cart!`, 2);
      return res.data.newCart;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const removeFromCart = async (bookId, cart, removeAll = 'none') => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/cart/removeW',
      data: { bookId, cart, removeAll },
    });
    if (res.data.status === 'success') {
      showAlert('success', `Successfully removed book from cart!`, 2);
      // window.setTimeout(() => {
      //   location.assign('/cart');
      // }, 1000);
      return res.data.newCart;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const sendCart = async (cart) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/getCart',
      data: { cart },
    });
    if (res.data.success) {
      return;
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 2);
  }
};
