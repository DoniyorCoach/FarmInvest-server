const validator = require('validator');

const registerValidate = (login, email, password) => {
  if ((typeof login && typeof email && typeof password) === 'string') {
    const loginCheck = validator.isLength(login, { min: 3, max: 12 });
    const emailCheck =
      validator.isEmail(email) &&
      validator.isLength(email, { min: 7, max: 35 });
    const passwordCheck = validator.isLength(password, { min: 6, max: 22 });

    if (loginCheck && emailCheck && passwordCheck) return true;
  }
  return false;
};

const loginValidate = (email, password) => {
  if ((typeof email && typeof password) === 'string') {
    const emailCheck =
      validator.isEmail(email) &&
      validator.isLength(email, { min: 7, max: 50 });
    const passwordCheck = validator.isLength(password, { min: 6, max: 20 });

    if (emailCheck && passwordCheck) return true;
  }
  return false;
};

module.exports = { registerValidate, loginValidate };
