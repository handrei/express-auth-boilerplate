const jwt = require('jsonwebtoken');

const config = require('../config');
const validationHandler = require('../validations/validationHandler');
const User = require('../models/user');

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Wrong credentials');
      error.statusCode = 401;
      throw error;
    }
    const validPassword = await user.validPassword(password);
    if (!validPassword) {
      const error = new Error('Wrong credentials');
      error.statusCode = 401;
      throw error;
    }
    const payload = {
      id: user.id,
      name: user.name
    };
    return await jwt.sign(
      payload,
      config.secretOrKey,
      { expiresIn: 3600 },
      (err, token) => {
        res.json({
          user: user,
          token: 'Bearer ' + token
        });
      }
    );
    // return res.send({ user, token });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    validationHandler(req);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.statusCode = 403;
      throw error;
    }
    let user = new User();
    user.email = req.body.email;
    user.password = await user.encryptPassword(req.body.password);
    user.name = req.body.name;
    user = await user.save();

    return res.send({ user });
  } catch (err) {
    next(err);
  }
};
