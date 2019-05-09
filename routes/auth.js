const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const passportJWT = require('../middlewares/passportJWT')();

router.post('/login', authController.login);
router.post('/signup', authController.signup);

module.exports = router;
