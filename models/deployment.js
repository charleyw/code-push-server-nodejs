const AV = require('leanengine');
const App = require('./app');

class Deployment extends AV.Object {
  static find_by_app_name(name) {
    const innerQuery = new AV.Query(App);
    innerQuery.equalTo('name', name);
    const query = new AV.Query(Deployment);
    query.matchesQuery('app', innerQuery);

    return query.find();
  }
}
module.exports = Deployment;