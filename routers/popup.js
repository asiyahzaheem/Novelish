export const activatePopup = (array, form) => {
  array.forEach((btn) => {
    btn.addEventListener('click', function () {
      const popupEl = document.getElementById(
        this.id === 'forgotPw' ? 'forgotPwPopup' : 'signupPopup'
      );
      popupEl.classList.add('open-popup');
      form.classList.add('active');
    });
  });
};

export const submitPopup = (array, form) => {
  array.forEach((btn) => {
    btn.addEventListener('click', function () {
      const popupEl = document.getElementById(
        this.id === 'forgotPwSubmit' ? 'forgotPwPopup' : 'signupPopup'
      );
      popupEl.classList.remove('open-popup');
      form.classList.remove('active');
    });
  });
};
