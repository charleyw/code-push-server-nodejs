const AV = require('leanengine');
const User = require('./user');
const App = require('./app');
const Deployment = require('./deployment');
const FullPackage = require('./full-package');
const UpdatePackage = require('./update-package');
const Device = require('./device');
const DeviceDownload = require('./device-download');
const DeviceDeploy = require('./device-deploy');

AV.Object.register(User);
AV.Object.register(App);
AV.Object.register(Deployment);
AV.Object.register(FullPackage);
AV.Object.register(UpdatePackage);
AV.Object.register(Device);
AV.Object.register(DeviceDownload);
AV.Object.register(DeviceDeploy);