import axios from 'axios';
import { showAlert } from './alerts';

// export const updateUserData = async (name, email) => {
//   try {
//     const res = await axios({
//       method: 'patch',
//       url: 'http://127.0.0.1:5000/api/v1/users/updateMe',
//       data: { name, email },
//     });
//     if (res.data.status === 'success') {
//       showAlert('success', 'Data updated successfully!');
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? 'http://127.0.0.1:5000/api/v1/users/updateMe'
        : 'http://127.0.0.1:5000/api/v1/users/updateMyPassword';
    const res = await axios({
      method: 'patch',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type} updated successfully!`, 3);
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 3);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:5000/api/v1/users/forgotPassword',
      data: { email, from: 'email' },
    });
    if (res.data.status === 'success') {
      showAlert(
        'success',
        'A password reset link has been sent to your email!'
      );
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'patch',
      url: `http://127.0.0.1:5000/api/v1/users/resetPassword/${token}`,
      data: { password, passwordConfirm },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Your password has been reset!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
