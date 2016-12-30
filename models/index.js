const AV = require('leanengine');
const User = require('./user');
const App = require('./app');

AV.Object.register(User);
AV.Object.register(App);