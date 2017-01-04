'use strict';
var router = require('express').Router({mergeParams: true});
var AV = require('leanengine');
var jwt = require('jsonwebtoken');
var FullPackage = require('../models/full-package');
var Device = require('../models/device');

router.get('/', function (req, res, next) {
  Device.findOrCreateBy(req.query.clientUniqueId).then(() => {
    return FullPackage.findLatestBy(req.query.deploymentKey, req.query.appVersion)
      .then(p => {
        if (p) {
          res.json({
            updateInfo: {
              description: p.get('description'),
              label: p.get('id'),
              appVersion: p.get('appVersion'),
              updateAppVersion: false,
              packageHash: p.get('packageHash'),
              downloadURL: p.get('url'),
              isAvailable: true
            }
          })
        } else {
          res.json({isAvailable: false})
        }
      })
      .catch(e => {
        console.log('Update check failed');
        console.log(e);
        res.json({isAvailable: false});
      })
  }).catch(e => {
    console.log('create device failed');
    console.log(e);
    res.json({isAvailable: false});
  });
});

module.exports = router;
