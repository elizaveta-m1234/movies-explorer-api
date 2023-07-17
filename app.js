require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/error-handler');
const { PORT, DB_URL } = require('./utils/config');

const app = express();
app.use(express.json());

app.use(helmet());

app.use(cors());

mongoose.connect(DB_URL);

app.use(requestLogger); // подключаем логгер запросов

// роутер
app.use('/', require('./routes/index'));

app.use(errorLogger); // подключаем логгер ошибок

// здесь обрабатываем все ошибки
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
