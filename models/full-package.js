const AV = require('leanengine');
const Deployment = require('./deployment');

class FullPackage extends AV.Object {
  static findLatestBy(deploymentKey, appVersion) {
    const query = new AV.Query(FullPackage);
    query.equalTo('deployment', AV.Object.createWithoutData('Deployment', deploymentKey));
    query.equalTo('appVersion', appVersion || '');
    query.descending('createdAt');
    return query.first();
  }
}
module.exports = FullPackage;