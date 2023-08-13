const Movie = require('../models/movie');
const { created } = require('../utils/constants');
const InternalError = require('../errors/internal-server-error');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found');
const Forbidden = require('../errors/forbiden');

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).sort({ createdAt: -1 })
    .then((movies) => res.send(movies))
    // При обработке ошибок в блоке catch они не выбрасываются через throw , а передаются в
    // централизованный обработчик ошибок с помощью next
    .catch(() => next(new InternalError('Ошибка по умолчанию')));
};

// создаёт фильм с переданными в теле
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(created).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при добавлении фильма'));
        return;
      }
      next(new InternalError('Ошибка по умолчанию'));
    });
};

// удаляет сохранённый фильм по id
module.exports.deleteMovie = (req, res, next) => {
  const id = req.user.movieId;

  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      if (id !== movie.owner.toString()) {
        throw new Forbidden('Отсутствует доступ');
      }
      movie.deleteOne()
        .then(() => res.send({ message: 'Фильм удален' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Фильм с указанным _id не найден'));
        return;
      }
      next(err);
    });
};
