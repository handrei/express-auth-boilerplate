const jwt = require('jsonwebtoken');

const config = require('../config');
const User = require('../models/user');
const validateRegisterInput = require('../validations/register');
const validateLoginInput = require('../validations/login');

exports.login = async (req, res, next) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body);
    const email = req.body.email;
    const password = req.body.password;

    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    user = await User.findOne({ email }).select('+password');
    if (!user) {
      errors.email = 'user not found';
      return res.status(404).json(errors);
    }
    const validPassword = await user.validPassword(password);
    if (!validPassword) {
      errors.password = 'password incorrect';
      return res.status(400).json(errors);
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
    const { errors, isValid } = validateRegisterInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      errors.email = 'email already exists';
      return res.status(400).json(errors);
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
