'use strict';
const fs = require('fs');
const os = require('os');
const AV = require('leanengine');
const unzip = require('unzip2');
const router = require('express').Router({mergeParams: true});
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const User = require('../models/user');
const AppPacker = require('../app-packer');
const Deployment = require('../models/deployment');
const FullPackage = require('../models/full-package');

router.get('/', function (req, res, next) {
  Deployment.byAppNameAndUserId(req.params.appName, req.user.id).then(ds => {
    Promise.all(ds.map(d => d.latest_full_package())).then(fps => {
      const resp = {
        deployments: ds.map((d, i) => {
          let results = {
            name: d.get('name'),
            key: d.get('id')
          };
          if (fps[i]) {
            results.package = {
              label: fps[i].get('id'),
              appVersion: fps[i].get('appVersion'),
              uploadTime: fps[i].get('createdAt'),
              isMandatory: fps[i].get('isMandatory'),
              releasedBy: fps[i].get('user').get('email'),
              description: fps[i].get('description')
            }
          }

          return results;
        })
      };

      res.json(resp)
    });
  })
});

const unzipPackage = (zipFilePath, zipName) => new Promise((resolve, reject) => {
  const localPackagePath = `${os.tmpdir()}/${zipName}.unzipped`;
  fs.createReadStream(zipFilePath).pipe(unzip.Extract({path: localPackagePath}))
    .on('close', () => resolve({baseDir: localPackagePath, originalFilePath: zipFilePath, originalFileName: zipName}))
    .on('error', reject);
});

const generateManifest = options => new Promise((resolve, reject) => {
  new AppPacker().generateManifest(options.baseDir).then(manifest => resolve(Object.assign({}, options, {manifest})))
});

const deploymentFullPackage = (packageInfo, deployment, user) => options => new Promise((resolve, reject) => {
  const fullPackageFile = fs.readFileSync(options.originalFilePath);

  new AV.File(options.originalFileName, {base64: new Buffer(fullPackageFile).toString('base64')}).save().then(file => {
    const fullPackage = new FullPackage();
    fullPackage.set('appVersion', packageInfo.appVersion);
    fullPackage.set('description', packageInfo.description);
    fullPackage.set('packageHash', options.manifest.version);
    fullPackage.set('isMandatory', packageInfo.isMandatory);
    fullPackage.set('manifest', JSON.stringify(options.manifest));
    fullPackage.set('deployment', deployment);
    fullPackage.set('user', user);
    fullPackage.set('url', file.url());
    fullPackage.save().then(savedFullPackage =>
      resolve(Object.assign({}, options, {packageInfo, fullPackage: savedFullPackage}))
    ).catch(err => console.log('error: ', err));
  }).catch(err => {
    reject(err);
  })
});

router.post('/:deploymentName/release', multipartMiddleware, function (req, res, next) {
  Deployment.findBy(req.params.appName, req.params.deploymentName)
    .then(deployments => {
      if (deployments.length) {
        unzipPackage(req.files.package.path, req.files.package.name)
          .then(generateManifest)
          .then(deploymentFullPackage(JSON.parse(req.body.packageInfo), deployments[0], AV.Object.createWithoutData('User', req.user.id)))
          .then(result => res.json({ok: true})).catch(err => {
            throw err
        })
      } else {
        res.json({error: 'no deployment found'})
      }
    }).catch(err => {
      throw err;
  });
});

router.get('/:depoymentName/metrics', function (req, res, next) {
  res.json({metrics: {}})
});

module.exports = router;
