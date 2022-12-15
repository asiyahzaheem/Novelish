import '@babel/polyfill';
import { addToCart, sendCart, removeFromCart } from './cart-index';
import { login, logout } from './login';
import { signup } from './signup';
import {
  updateSettings,
  forgotPassword,
  resetPassword,
} from './updateSettings';
import { purchase } from './stripe';
import { showAlert } from './alerts';

const body = document.body;
body.children[1].classList.add('margin');

// login form
const loginForm = document.querySelector('.login');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// for popup
const loginFormEl = document.querySelector('.login-form');

// signup
const signupform = document.querySelector('.signup');
if (signupform) {
  signupform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name-signup').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const passwordConfirm = document.getElementById(
      'confirmPassword-signup'
    ).value;
    await signup(name, email, password, passwordConfirm);
    if (document.querySelector('.alert')) {
      const popupEl = document.getElementById('signupPopup');
      popupEl.classList.remove('open-popup');
      loginFormEl.classList.remove('active');
      header.classList.remove('active');
    }
  });
}
// update user data form
const updateUserDataForm = document.querySelector('.form-user-data');
if (updateUserDataForm) {
  updateUserDataForm.addEventListener('submit', (e) => {
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    e.preventDefault();
    updateSettings(form, 'data');
  });
}

// update user password form
const updateUserPasswordForm = document.querySelector('.form-user-password');
if (updateUserPasswordForm) {
  updateUserPasswordForm.addEventListener('submit', async (e) => {
    document.querySelector('.btn__save-password-form').textContent =
      'Updating...';
    e.preventDefault();
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

// forgot password popup
const getForgotPasswordForm = document.querySelector('.resetPw');
if (getForgotPasswordForm) {
  getForgotPasswordForm.addEventListener('submit', async (e) => {
    document.querySelector('.forgotPwSubmit').innerHTML = 'Processing...';
    e.preventDefault();
    const email = document.getElementById('email-reset').value;
    await forgotPassword(email);
    document.querySelector('.forgotPwSubmit').innerHTML = 'Submit';
    if (document.querySelector('.alert')) {
      const popupEl = document.getElementById('forgotPwPopup');
      popupEl.classList.remove('open-popup');
      loginFormEl.classList.remove('active');
      header.classList.remove('active');
    }
  });
}

// reset password form
const getResetPasswordForm = document.querySelector('.reset');
if (getResetPasswordForm) {
  const token = window.location.pathname.substring(15);
  getResetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('newPassword-reset').value;
    const passwordConfirm = document.getElementById(
      'confirmPassword-reset'
    ).value;
    await resetPassword(token, password, passwordConfirm);
    document.getElementById('newPassword-reset').value = '';
    document.getElementById('confirmPassword-reset').value = '';
  });
}

// logout
const logoutBtnEl = document.querySelector('.nav__logout');
if (logoutBtnEl) logoutBtnEl.addEventListener('click', logout);

// activate popup
const btnActivateArr = Array.from(document.querySelectorAll('.popup-btn'));
const btnClosePopupArr = Array.from(
  document.querySelectorAll('.closePopup-btn')
);
const header = document.querySelector('.nav-books');

btnActivateArr.forEach((btn) => {
  btn.addEventListener('click', function () {
    const popupEl = document.getElementById(
      this.id === 'forgotPw' ? 'forgotPwPopup' : 'signupPopup'
    );
    popupEl.classList.add('open-popup');
    loginFormEl.classList.add('active');
    header.classList.add('active');
  });
});

btnClosePopupArr.forEach((btn) => {
  btn.addEventListener('click', function () {
    const popupEl = document.getElementById(
      this.id === 'forgotPwSubmit' ? 'forgotPwPopup' : 'signupPopup'
    );
    popupEl.classList.remove('open-popup');
    loginFormEl.classList.remove('active');
    header.classList.remove('active');
  });
});

// slider
const container = [...document.querySelectorAll('.cards')];
const nextBtn = document.querySelector('.btn__slide-right');
const prevBtn = document.querySelector('.btn__slide-left');

if (container && nextBtn && prevBtn) {
  container.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;
    nextBtn.addEventListener('click', () => {
      item.scrollLeft += containerWidth;
    });
    prevBtn.addEventListener('click', () => {
      item.scrollLeft -= containerWidth;
    });
  });
}

const btnAddToCartArr = Array.from(document.querySelectorAll('.addToCart'));
if (btnAddToCartArr) {
  btnAddToCartArr.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      let cart;
      if (window.localStorage.getItem('cart')) {
        cart = JSON.parse(window.localStorage.getItem('cart'));
        if (cart.totalQty === 10) {
          showAlert(
            'error',
            'A maximum of 10 items can be added to your cart!'
          );
          if (window.location.pathname === '/cart') {
            window.location.assign('/cart');
          }
          return;
        }
        // return;
      } else {
        cart = {};
      }
      const bookId = btn.dataset.bookid;
      cart = await addToCart(bookId, cart);
      window.localStorage.setItem('cart', JSON.stringify(cart));
      sendCart(cart);
      window.location.reload();
    });
  });
}

const btnRemoveFromCartArr = Array.from(
  document.querySelectorAll('.removeFromCart')
);

if (btnRemoveFromCartArr) {
  btnRemoveFromCartArr.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      let cart;
      cart = JSON.parse(window.localStorage.getItem('cart'));
      const bookId = btn.dataset.bookid;
      if (btn.dataset.remove === 'all') {
        cart = await removeFromCart(bookId, cart, 'all');
        if (cart.totalQty === 0) {
          window.localStorage.removeItem('cart');
          window.location.assign('/');
          return;
        }
        window.localStorage.setItem('cart', JSON.stringify(cart));
        sendCart(cart);
        window.location.reload();
        return;
      }
      cart = await removeFromCart(bookId, cart);
      if (cart.totalQty != 0) {
        window.localStorage.setItem('cart', JSON.stringify(cart));
        sendCart(cart);
        window.location.reload();
      } else {
        window.localStorage.removeItem('cart');
        window.location.assign('/');
      }
    });
  });
}

const navCartEl = document.querySelector('.nav__link-cart');
if (navCartEl) {
  navCartEl.addEventListener('click', (e) => {
    e.preventDefault();
    const cart = JSON.parse(window.localStorage.getItem('cart'));
    if (cart) {
      sendCart(cart);
      window.location.assign('/cart');
    } else {
      showAlert('error', 'Cart is empty!', 3);
    }
  });
}
// delete icon removes item completely

const checkoutBtn = document.getElementById('checkout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const cart = JSON.parse(window.localStorage.getItem('cart'));
    purchase(cart);
  });
}

const cart = JSON.parse(window.localStorage.getItem('cart'));
if (cart) {
  const html = `<div class='cart__display-qty'><span>${cart.totalQty}</span></div>`;
  const navCartEl = document.querySelector('.nav__link-cart');
  navCartEl.insertAdjacentHTML('beforeend', html);
  navCartEl.classList.add('pos__relative');
}
