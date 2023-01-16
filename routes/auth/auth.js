const express = require('express');
const router = express.Router();
const User = require('../users/user.model');
const validator = require('validator');
const RefreshToken = require('./rt.model');
const auth = require('../../tools/auth');
const uuid = require("uuid");
const bcrypt=require("bcryptjs");

router.post('/register' ,async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw {
        status: 400,
        error: new Error('Missing email or password')
      };
    }

    if (validator.isEmail(req.body.email) === false) {
      throw {
        status: 400,
        error: new Error('Invalid email')
      };
    }

    const user = await new User({
      email: req.body.email,
      password: req.body.password,
      role: 'user'
    }).save();


    res.json(user);
  } catch (err) {
    console.log(err)
    next(err);
  }
});

router.post('/login' ,async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw {
        status: 400,
        error: new Error('Missing email or password')
      };
    }

    const user = await User.findOne({
      email: req.body.email
    });
    const isMatch=bcrypt.compareSync(req.body.password,user.password)

    if (!user || !isMatch) {
      throw {
        status: 401,
        error: new Error('Invalid email or password')
      };
    }
    res.cookie('role',user.role)
    const refreshToken = await new RefreshToken({
      user: user._id,
      token: auth.createToken(user),
      rt: uuid.v4()
    }).save();

    res.cookie('token',refreshToken.token);
    res.cookie('refreshToken',refreshToken.rt)
    res.json(refreshToken);

  } catch (err) {
    next(err);
  }
});

module.exports = router;
