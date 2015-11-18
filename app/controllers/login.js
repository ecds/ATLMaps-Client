import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {

  authenticator: 'simple-auth-authenticator:oauth2-password-grant',
  
  actions: {

    // display an error when authentication fails
    authenticate: function () {
      var self = this;
      this._super().then(function () {
        Ember.Logger.debug('Session authentication succeeded');
      }, function (error) {
        Ember.Logger.debug('Session authentication failed with message:',
          error.message);
        self.set('errorMessage', 'Invalid email/password combination.');
      });
    }

  }

});