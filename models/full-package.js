const AV = require('leanengine');

class FullPackage extends AV.Object {
  constructor(appVersion, description, packageHash, isMandatory, manifest) {
    this.set('appVersion', appVersion);
    this.set('description', description);
    this.set('packageHash', packageHash);
    this.set('isMandatory', isMandatory);
    this.set('manifest', manifest)
  }
}
module.exports = FullPackage;