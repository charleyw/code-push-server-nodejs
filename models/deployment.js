const AV = require('leanengine');
const App = require('./app');
const FullPackage = require('./full-package');

class Deployment extends AV.Object {
  static find_by_app_name(name) {
    const innerQuery = new AV.Query(App);
    innerQuery.equalTo('name', name);
    const query = new AV.Query(Deployment);
    query.matchesQuery('app', innerQuery);

    return query.find();
  }

  static find_by(appName, deploymentName) {
    const innerQuery = new AV.Query(App);
    innerQuery.equalTo('name', appName);
    const query = new AV.Query(Deployment);
    query.matchesQuery('app', innerQuery);
    query.equalTo('name', deploymentName);

    return query.find();
  }

  latest_full_package() {
    const query = new AV.Query(FullPackage);
    query.equalTo('deployment', this);
    query.descending('createdAt');
    query.include('deployment');
    return query.first();
  }
}
module.exports = Deployment;