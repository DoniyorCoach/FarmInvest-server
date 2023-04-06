const bcrypt = require('bcrypt');

const { registerValidate, loginValidate } = require('../validations/user');
const generateJWT = require('../helpers/generateJWT');
const User = require('../models/User');
const UserDTO = require('../dtos/UserDTO');

const register = async (req, res) => {
  try {
    const { login, email, password } = req.body;

    if (registerValidate(login, email, password)) {
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.json({
          status: 403,
          message: 'Пользователь с таким email уже существует!',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
        login: login,
        email: email,
        password: hashedPassword,
      };

      User.create(userData, (err, data) => {
        if (err)
          res.json({
            status: 500,
            message: 'Ошибка сервера. Повторите попытку позже!',
          });
        res.json({ status: 201, message: 'Ваш аккаунт успешно создан!' });
      });
    } else {
      res.json({ status: 400, message: 'Введены некорректные данные!' });
    }
  } catch (error) {
    req.logger.error(error);
    res.json({
      status: 500,
      message: 'Ошибка сервера. Повторите попытку позже!',
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (loginValidate(email, password)) {
      const candidate = await User.findOne({ email });
      if (!candidate) {
        return res.json({ status: 403, message: 'Пользователь не найден!' });
      }

      const isPassEqual = await bcrypt.compare(password, candidate.password);
      if (!isPassEqual) {
        return res.json({ status: 403, message: 'Неверно введен пароль!' });
      }

      const token = generateJWT(candidate._id);

      const userDTO = new UserDTO(candidate);

      res.json({ status: 200, message: { token, user: userDTO } });
    } else {
      res.json({ status: 400, message: 'Введены некорректные данные!' });
    }
  } catch (error) {
    req.logger.error(error);
    res.json({
      status: 500,
      message: 'Ошибка сервера. Повторите попытку позже!',
    });
  }
};

const auth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const token = generateJWT(user.id);

    const userDTO = new UserDTO(user);

    res.json({ status: 200, message: { token, user: userDTO } });
  } catch (e) {
    req.logger.error(error);
    res.json({
      status: 500,
      message: 'Ошибка сервера. Повторите попытку позже!',
    });
  }
};

module.exports = { register, login, auth };
