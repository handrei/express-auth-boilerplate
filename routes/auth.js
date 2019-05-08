const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { isEmail, hasPassword, hasName } = require('../validations/validators');
const passportJWT = require('../middlewares/passportJWT')();

router.post('/login', authController.login);
router.post('/signup', [isEmail, hasPassword, hasName], authController.signup);

module.exports = router;
