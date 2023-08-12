const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  }, // — страна создания фильма. Обязательное поле-строка.
  director: {
    type: String,
    required: true,
  }, // — режиссёр фильма. Обязательное поле-строка.
  duration: {
    type: Number,
    required: true,
  }, //  — длительность фильма. Обязательное поле-число.
  year: {
    type: String,
    required: true,
  }, //  — год выпуска фильма. Обязательное поле-строка.
  description: {
    type: String,
    required: true,
  }, //  — описание фильма. Обязательное поле-строка.
  image: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+#?$/i.test(link);
      },
    },
  }, //  — ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+#?$/i.test(link);
      },
    },
  }, //  — ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом.
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+#?$/i.test(link);
      },
    },
  }, //  — миниатюрное изображение постера к фильму.
  // Обязательное поле- строка.Запишите её URL - адресом.
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }, //  — _id пользователя, который сохранил фильм. Обязательное поле.
  movieId: {
    type: Number,
    required: true,
  }, //  — id фильма, который содержится в ответе сервиса MoviesExplorer.
  // Обязательное поле в формате number.
  nameRU: {
    type: String,
    required: true,
  }, //  — название фильма на русском языке. Обязательное поле-строка.
  nameEN: {
    type: String,
    required: true,
  }, //  — название фильма на английском языке. Обязательное поле-строка.
});

module.exports = mongoose.model('card', movieSchema);
