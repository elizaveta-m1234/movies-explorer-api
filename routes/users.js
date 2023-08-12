const router = require('express').Router();
const { editProfile, getCurrentUser } = require('../controllers/users');
const { updateInfoValidator } = require('../middlewares/validator');

// возвращает информацию о текущем пользователе
router.get('/me', getCurrentUser);
// обновляет профиль
router.patch('/me', updateInfoValidator, editProfile);

module.exports = router;
