const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { created } = require('../utils/constants');
const InternalError = require('../errors/internal-server-error');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found');
const Conflict = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

// возвращает информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Пользователь по указанному _id не найден'));
        return;
      }
      next(new InternalError('Ошибка по умолчанию'));
    });
};

// создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(created).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с такой почтой уже существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
        return;
      }
      next(new InternalError('Ошибка по умолчанию'));
    });
};

// обновляет профиль
module.exports.editProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с такой почтой уже существует'));
        return;
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Пользователь с указанным _id не найден'));
        return;
      }
      next(new InternalError('Ошибка по умолчанию'));
    });
};

// контроллер login, который получает из запроса почту и пароль и проверяет их
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};
