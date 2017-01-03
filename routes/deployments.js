'use strict';
const router = require('express').Router({mergeParams: true});
const App = require('../models/app');
const Deployment = require('../models/deployment');

router.get('/', function(req, res, next) {
  Deployment.find_by_app_name(req.params.appName).then(ds => {
    res.json({deployments: ds.map(d => ({
      name: d.get('name'),
      key: d.get('id'),
      package: {
        label: '123',
        appVersion: '123',
        uploadTime: new Date(),
        isMandatory: false,
        releasedBy: 'chao',
        description: 'asdfsdfasdf'
      }
    }))})
  })
});

module.exports = router;
