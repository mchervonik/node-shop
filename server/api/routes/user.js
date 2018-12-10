const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

const checkAuth = require('../middleware/check-auth');

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', /*checkAuth,*/ UserController.user_delete);

router.get('/all',/*checkAuth,*/UserController.user_get_all);


module.exports = router;