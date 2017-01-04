'use strict';
var router = require('express').Router({mergeParams: true});
var DeviceDownload = require('../models/device-download');
var DeviceDeploy = require('../models/device-deploy');

router.post('/download', function (req, res, next) {
  // { clientUniqueId: '721348A1-2FF0-405F-BF75-AA02AC3C2B37',
  //   deploymentKey: '586c52e3128fe1005832a277',
  //   label: '586bc2a38d6d8100585fef8e' }
  const deviceDownload = new DeviceDownload();

  deviceDownload.set('clientUniqueId', req.body.clientUniqueId);
  deviceDownload.set('deploymentKey', req.body.deploymentKey);
  deviceDownload.set('label', req.body.label);
  deviceDownload.save().then(() => res.json({ok: true})).catch(() => res.json({ok: true}))
});

router.post('/deploy', function(req, res, next) {
  console.log(req.body)
  // { appVersion: '0.0.1',
  //   deploymentKey: '586c52e3128fe1005832a277',
  //   clientUniqueId: '721348A1-2FF0-405F-BF75-AA02AC3C2B37',
  //   label: '586bc2a38d6d8100585fef8e',
  //   status: 'DeploymentFailed',
  //   previousLabelOrAppVersion: '0.0.1',
  //   previousDeploymentKey: '586c52e3128fe1005832a277' }
  const deviceDeploy = new DeviceDeploy();

  deviceDeploy.set('clientUniqueId', req.body.clientUniqueId);
  deviceDeploy.set('deploymentKey', req.body.deploymentKey);
  deviceDeploy.set('appVersion', req.body.appVersion);
  deviceDeploy.set('label', req.body.label);
  deviceDeploy.set('status', req.body.status);
  deviceDeploy.set('previousLabelOrAppVersion', req.body.previousLabelOrAppVersion);
  deviceDeploy.set('previousDeploymentKey', req.body.previousDeploymentKey);
  deviceDeploy.save().then(() => res.json({ok: true})).catch(() => res.json({ok: true}))
});

module.exports = router;
