import Ember from 'ember';

/* global md5 */

export default Ember.Component.extend({
  	email: '',

  gravatarUrl: function() {
    var email = this.get('email'),
        size = 55;

    return 'http://www.gravatar.com/avatar/' + md5(email) + '?s=' + size;
  }.property('email')
});
