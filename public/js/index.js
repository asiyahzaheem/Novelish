import { login, logout } from './login';
import { purchase } from './stripe';
import { addToCart, removeFromCart, sendCart } from './cart-index';
import { signup } from './signup';
import {
  resetPassword,
  forgotPassword,
  updateSettings,
} from './updateSettings';
import { showAlert } from './alerts';

const body = document.querySelector('body');
body.children[0].classList.add('margin');

const signupForm = document.querySelector('.signup');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.signupSubmit').innerHTML = 'Processing...';
    const name = document.getElementById('name-signup').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const confirmPassword = document.getElementById(
      'confirmPassword-signup'
    ).value;
    await signup(name, email, password, confirmPassword);
    document.querySelector('.signupSubmit').innerHTML = 'Create';
  });
}
const loginForm = document.querySelector('.login');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

const logoutBtn = document.querySelector('.nav__logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

const forgotPasswordForm = document.querySelector('.resetPw');

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.forgotPwSubmit').innerHTML = 'Sending...';
    const email = document.getElementById('email-reset').value;
    await forgotPassword(email);
    document.querySelector('.forgotPwSubmit').innerHTML = 'Submit';
  });
}

const resetForm = document.querySelector('.reset');
if (resetForm) {
  resetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword-reset').value;
    const confirmPassword = document.getElementById(
      'confirmPassword-reset'
    ).value;
    const token = window.location.pathname.split('/')[2];
    resetPassword(token, newPassword, confirmPassword);
  });
}

const popupBtn = document.querySelectorAll('.popup-btn');
const popupBtnArr = Array.from(popupBtn);
const loginFormEl = document.querySelector('.login-form');
const navMain = document.querySelector('.nav-books');

if (popupBtnArr) {
  popupBtnArr.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const popup = btn.id === 'forgotPw' ? 'forgotPwPopup' : 'signupPopup';
      document.getElementById(popup).classList.add('open-popup');
      loginFormEl.classList.add('active');
      navMain.classList.add('active');
    });
  });
}

const closePopupBtn = document.querySelectorAll('.closePopup-btn');
const closePopupBtnArr = Array.from(closePopupBtn);

if (closePopupBtnArr) {
  closePopupBtnArr.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const popup =
        btn.id === 'forgotPwSubmit' ? 'forgotPwPopup' : 'signupPopup';
      document.getElementById(popup).classList.remove('open-popup');
      loginFormEl.classList.remove('active');
      navMain.classList.remove('active');
    });
  });
}

const userDataForm = document.querySelector('.form-user-data');
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

const userPasswordForm = document.querySelector('.form-user-password');
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn__save-password-form').textContent =
      'Updating...';
    const passwordCurrent = document.getElementById('currentPassword').value;
    const password = document.getElementById('newPassword').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn__save-password-form').textContent =
      'Save password';
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
  });
}

const slideContainerEl = document.querySelector('.cards');
const slidePrevBtn = document.querySelector('.btn__slide-left');
const slideNextBtn = document.querySelector('.btn__slide-right');

if (slideContainerEl) {
  let containerDimensions = slideContainerEl.getBoundingClientRect();
  let containerWidth = containerDimensions.width;
  slideNextBtn.addEventListener('click', () => {
    slideContainerEl.scrollLeft += containerWidth;
  });
  slidePrevBtn.addEventListener('click', () => {
    slideContainerEl.scrollLeft -= containerWidth;
  });
}

const addToCartBtn = document.querySelectorAll('.addToCart');
const addToCartBtnArr = Array.from(addToCartBtn);
if (addToCartBtnArr) {
  addToCartBtnArr.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      let cart = window.localStorage.getItem('cart');
      cart = JSON.parse(cart);
      if (!cart) {
        cart = {};
      } else if (cart.totalQty === 10) {
        showAlert(
          'error',
          'A maximum of 10 books can be added to the cart!',
          3
        );
        return;
      }
      const bookId = btn.dataset.bookid;
      cart = await addToCart(bookId, cart);
      window.localStorage.setItem('cart', JSON.stringify(cart));

      if (window.location.pathname === '/cart') {
        sendCart(cart);
        window.location.assign('/cart');
      }
    });
  });
}

const removeFromCartBtn = document.querySelectorAll('.removeFromCart');
const removeFromCartBtnArr = Array.from(removeFromCartBtn);

if (removeFromCartBtnArr) {
  removeFromCartBtnArr.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      let cart = window.localStorage.getItem('cart');
      cart = JSON.parse(cart);
      const bookId = btn.dataset.bookid;
      if (btn.dataset.remove === 'all') {
        cart = await removeFromCart(bookId, cart, 'all');
      } else {
        cart = await removeFromCart(bookId, cart);
      }
      if (cart.totalQty === 0) {
        window.localStorage.removeItem('cart');
        window.location.assign('/');
      } else {
        window.localStorage.setItem('cart', JSON.stringify(cart));
        sendCart(cart);
        window.location.assign('/cart');
      }
    });
  });
}

const cartBtn = document.querySelector('.nav__link-cart');

if (cartBtn) {
  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let cart = window.localStorage.getItem('cart');
    if (!cart) {
      showAlert('error', 'Cart is empty!');
    } else {
      cart = JSON.parse(cart);
      console.log(cart);
      sendCart(cart);
      window.location.assign('/cart');
    }
  });
}

const orderBtn = document.getElementById('checkout');
if (orderBtn) {
  orderBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const cart = window.localStorage.getItem('cart');
    purchase(JSON.parse(cart));
  });
}
