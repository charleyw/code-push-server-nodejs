'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  const params = req.body;
  let error;

  if(params.password !== params.passwordConfirmation) {
    error = '密码不一致'
  }
  if(error){
    res.render('register', {error: error});
  } else {
    const user = new User();
    user.setUsername(params.email);
    user.setPassword(params.password);
    user.setEmail(params.email);
    user.signUp().then(function (user) {
      res.render('registered', {token: jwt.sign({ id: user.id }, 'shhhhhhared-secret')});
    }, function (error) {
      res.render('register', {error: error});
    });
  }
});

router.get('/login', function(req, res, next){
  res.render('login');
});

router.post('/login', function(req, res, next){
  const params = req.body;

  AV.User.logIn(params.email, params.password).then(function (user) {
    res.render('logged', {token: jwt.sign({ id: user.id }, 'shhhhhhared-secret')});
  }, function (error) {
    res.render('login', {error: error});
  });
});

module.exports = router;
