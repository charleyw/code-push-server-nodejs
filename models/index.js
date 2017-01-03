const AV = require('leanengine');
const User = require('./user');
const App = require('./app');
const Deployment = require('./deployment');
const FullPackage = require('./full-package');
const UpdatePackage = require('./update-package');

AV.Object.register(User);
AV.Object.register(App);
AV.Object.register(Deployment);
AV.Object.register(FullPackage);
AV.Object.register(UpdatePackage);