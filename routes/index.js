const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { signinValidator, signupValidator } = require('../middlewares/validator');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/not-found');

router.post('/signin', signinValidator, login);
router.post('/signup', signupValidator, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));// отправить ошибку с кодом 404
});

router.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

module.exports = router;
