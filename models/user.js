const AV = require('leanengine');
const App = require('./app');

class User extends AV.User {
  static find(id) {
    const query = new AV.Query(User);
    return query.get(id);
  }

  static createWithoutData(id) {
    return AV.Object.createWithoutData('User', id)
  }

  apps() {
    const query = new AV.Query(App);
    query.equalTo('user', this);
    return query.find();
  }
}

module.exports = User;
