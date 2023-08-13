const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { createMovieValidator, deleteValidator } = require('../middlewares/validator');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/', getMovies);
// создаёт фильм с переданными в теле
router.post('/', createMovieValidator, createMovie);
// удаляет сохранённый фильм по id
router.delete('/:movieId', deleteValidator, deleteMovie);

module.exports = router;
