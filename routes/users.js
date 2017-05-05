const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const User = require('../models/user')

router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })

  User.addUser(newUser, (err, user) => {

    if (err) {
      res.json({success: false, msg: "User registration failed"})
    }else{
      res.json({success: true, msg: "User registration success"})
    }

  })

  //res.send("Register")
})

router.post('/authenticate', (req, res, next) => {

  const username = req.body.username
  const password = req.body.password

  User.getUserByName(username, (err, user) => {
    User.matchPassword(password, user.password, (err, isMatch) => {
      if(err) {
        res.json({success: false, msg: "User not found"})
      }
      if(!isMatch){
        res.json({success: false, msg: "Password mismatch"})
      }else{
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604000
        })
        res.json({
          success: true,
          token : "JWT " + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      }
    })
  })

})

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user})
})

module.exports = router;
