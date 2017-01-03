const AV = require('leanengine');
const User = require('./user');
const App = require('./app');
const Deployment = require('./deployment');

AV.Object.register(User);
AV.Object.register(App);
AV.Object.register(Deployment);