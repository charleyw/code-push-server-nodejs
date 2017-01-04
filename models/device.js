const AV = require('leanengine');

class Device extends AV.Object {
  static find(id) {
    const query = new AV.Query(Device);
    return query.get(id);
  }

  static findByClientUniqueId(clientId) {
    const query = new AV.Query(Device);
    query.equalTo('clientUniqueId', clientId);
    return query.first();
  }

  static findOrCreateBy(clientUniqueId) {
    const query = new AV.Query(Device);
    query.equalTo('clientUniqueId', clientUniqueId);
    return query.first().then(d => {
      if(!d) {
        const device = new Device();
        device.set('clientUniqueId', clientUniqueId);
        return device.save();
      } else {
        return Promise.resolve(d)
      }
    });
  }
}

module.exports = Device;
