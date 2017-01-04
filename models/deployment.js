const AV = require('leanengine');
const App = require('./app');
const User = require('./user');
const FullPackage = require('./full-package');

class Deployment extends AV.Object {
  static byAppNameAndUserId(name, userId) {
    const innerQuery = new AV.Query(App);
    innerQuery.equalTo('name', name);
    innerQuery.equalTo('user', User.createWithoutData(userId));
    const query = new AV.Query(Deployment);
    query.matchesQuery('app', innerQuery);

    return query.find();
  }

  static findBy(appName, deploymentName, userId) {
    const innerQuery = new AV.Query(App);
    innerQuery.equalTo('name', appName);
    innerQuery.equalTo('user', User.createWithoutData(userId));
    const query = new AV.Query(Deployment);
    query.matchesQuery('app', innerQuery);
    query.equalTo('name', deploymentName);

    return query.find();
  }

  latest_full_package() {
    const query = new AV.Query(FullPackage);
    query.equalTo('deployment', this);
    query.descending('createdAt');
    query.include('user');
    return query.first();
  }
}
module.exports = Deployment;