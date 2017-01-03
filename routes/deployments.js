'use strict';
const fs = require('fs');
const os = require('os');
const AV = require('leanengine');
const unzip = require('unzip2');
const router = require('express').Router({mergeParams: true});
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const App = require('../models/app');
const AppPacker = require('../app-packer');
const Deployment = require('../models/deployment');
const FullPackage = require('../models/full-package');

router.get('/', function (req, res, next) {
  Deployment.find_by_app_name(req.params.appName).then(ds => {
    res.json({
      deployments: ds.map(d => ({
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
      }))
    })
  })
});

const unzipPackage = (zipFilePath, zipName) => new Promise((resolve, reject) => {
  const localPackagePath = `${os.tmpdir()}/${zipName}.unzipped`;
  fs.createReadStream(zipFilePath).pipe(unzip.Extract({path: localPackagePath}))
    .on('close', () => resolve({baseDir: localPackagePath, originalFilePath: zipFilePath, originalFileName: zipName}));
});

const generateManifest = options => new Promise((resolve, reject) => {
  new AppPacker().generateManifest(options.baseDir).then(manifest => resolve(Object.assign({}, options, {manifest})))
});

const deploymentFullPackage = (packageInfo, deployment) => options => new Promise((resolve, reject) => {
  const fullPackageFile = fs.readFileSync(options.originalFilePath);

  new AV.File(options.originalFileName, {base64: new Buffer(fullPackageFile).toString('base64')}).save().then(file => {
    const fullPackage = new FullPackage();
    fullPackage.set('appVersion', packageInfo.appVersion);
    fullPackage.set('description', packageInfo.description);
    fullPackage.set('packageHash', options.manifest.version);
    fullPackage.set('isMandatory', packageInfo.isMandatory);
    fullPackage.set('manifest', JSON.stringify(options.manifest));
    fullPackage.set('deployment', deployment);
    fullPackage.set('url', file.url());
    fullPackage.save().then(savedFullPackage =>
      resolve(Object.assign({}, options, {packageInfo, fullPackage: savedFullPackage}))
    ).catch(err => console.log('error: ', err));
  }).catch(err => {
    throw err;
  })
});

router.post('/:deploymentName/release', multipartMiddleware, function (req, res, next) {
  Deployment.find_by(req.params.appName, req.params.deploymentName)
    .then(deployments => {
      if (deployments.length) {
        unzipPackage(req.files.package.path, req.files.package.name)
          .then(generateManifest)
          .then(deploymentFullPackage(req.body.packageInfo, deployments[0]))
          .then(result => res.json({ok: true}))
      } else {
        res.json({error: 'no deployment found'})
      }
    });
});

module.exports = router;
