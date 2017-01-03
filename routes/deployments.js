'use strict';
const fs = require('fs');
const os = require('os');
const AV = require('leanengine');
const request = require('request');
const unzip = require('unzip2');
const router = require('express').Router({mergeParams: true});
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const App = require('../models/app');
const AppPacker = require('../app-packer');
const Deployment = require('../models/deployment');
const FullPackage = require('../models/full-package');

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

const unzipPackage = (zipFilePath, zipName) => new Promise((resolve, reject) => {
  const localPackagePath = `${os.tmpdir()}/${zipName}.unzipped`;
  fs.createReadStream(zipFilePath).pipe(unzip.Extract({ path: localPackagePath }))
    .on('close', () => resolve({baseDir: localPackagePath, originalFilePath: zipFilePath, originalFileName: zipName}));
});

const generateManifest = options => new Promise((resolve, reject) => {
  new AppPacker().generateManifest(options.baseDir).then(manifest => resolve(Object.assign({}, options, {manifest})))
});

const deploymentFullPackage = packageInfo => options => new Promise((resolve, reject) => {
  uploadPackageFile(options.originalFilePath, options.originalFileName).then(file => {
    const fullPackage = new FullPackage(packageInfo.appVersion, packageInfo.description, options.manifest.version, packageInfo.isMandatory, options.manifest, file.url());

    console.log(file)
    fullPackage.save().then(savedFullPackage =>
      resolve(Object.assign({}, options, {packageInfo, fullPackage: savedFullPackage}))
    );
  })
});

const uploadPackageFile = (fileLocalPath, fileName) => new Promise((resolve, reject) => {
  const headers = {'X-LC-Id': process.env.LEANCLOUD_APP_ID, 'X-LC-Key': process.env.LEANCLOUD_APP_KEY, 'Content-Type': "text/plain"};
  fs.createReadStream(fileLocalPath)
    .pipe(request.post({url: `https://api.leancloud.cn/1.1/files/${fileName}`, headers: headers}))
    .on('response', resp => {
      console.log(resp)
      resolve(resp)
    })
});

router.post('/:deploymentName/release', multipartMiddleware, function (req, res, next) {
  console.log(req.body.packageInfo)

  unzipPackage(req.files.package.path, req.files.package.name)
    .then(generateManifest)
    .then(deploymentFullPackage(req.body.packageInfo))
    .then(result => {
      console.log(result)
      res.json({ok: true, result})
    })
});

module.exports = router;
