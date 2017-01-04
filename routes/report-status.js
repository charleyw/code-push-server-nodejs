'use strict';
var router = require('express').Router({mergeParams: true});
var AV = require('leanengine');
var jwt = require('jsonwebtoken');
var Device = require('../models/device');

router.post('/download', function (req, res, next) {
  console.log(req.params)
  console.log(req.body)
  // { clientUniqueId: '721348A1-2FF0-405F-BF75-AA02AC3C2B37',
  //   deploymentKey: '586c52e3128fe1005832a277',
  //   label: '586bc2a38d6d8100585fef8e' }
  res.json({ok: true})
});

router.post('/deploy', function(req, res, next) {
  console.log(req.params)
  console.log(req.body)
  // { appVersion: '0.0.1',
  //   deploymentKey: '586c52e3128fe1005832a277',
  //   clientUniqueId: '721348A1-2FF0-405F-BF75-AA02AC3C2B37',
  //   label: '586bc2a38d6d8100585fef8e',
  //   status: 'DeploymentFailed',
  //   previousLabelOrAppVersion: '0.0.1',
  //   previousDeploymentKey: '586c52e3128fe1005832a277' }
  res.json({ok: true})
})

module.exports = router;
