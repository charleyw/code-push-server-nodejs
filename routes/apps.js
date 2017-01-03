'use strict';
var router = require('express').Router();
var deployments = require('./deployments');
var App = require('../models/app');
var User = require('../models/user');
var Deployment = require('../models/deployment');

router.get('/', function(req, res, next) {
  User.find(req.user.id).then(user => {
    user.apps().then(apps => {
      res.json({apps: apps.map(app => ({name: app.get('name'), deployments: []}))})
    })
  })
});

router.post('/', function(req, res, next) {
  User.find(req.user.id).then(user => {
    const app = new App();
    app.set('name', req.body.name);
    app.set('user', user);

    app.save().then((savedApp) => {
      const prod = new Deployment();
      prod.set('name', 'production');
      prod.set('app', savedApp);
      return prod.save();
    }).then(() => res.json({}), err => {
      throw err
    })
  })
});

router.use('/:appName/deployments', deployments);

module.exports = router;
