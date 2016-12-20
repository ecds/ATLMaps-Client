import Ember from 'ember';

/**
 * Service to track currently logged in user.
 * @type {Object}
 */
const { Service, inject: { service } } = Ember;

export default Service.extend({
  session: service('session'),
  store: service(),

  user: {},

  load() {
      let _this = this;
    if (this.get('session.isAuthenticated')) {
      return this.get('store').find('user', 'me').then(function(user) {
        _this.set('user', user);
      });
    }
  }
});
