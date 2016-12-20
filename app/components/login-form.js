import Ember from 'ember';

const {
  get,
  set,
  inject: {
    service
  },
  Component
} = Ember;

export default Component.extend({
  session: service(),
  ajax: service(),
  store: service(),

  newLogin: {},

  signUp: false,
  login: false,

  actions: {
    authenticateWithOAuth2() {
      let {
        identification,
        password
      } = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
    },

    authenticateWithFacebook() {
      this.get('session').authenticate('authenticator:torii', 'facebook');
    },

    authenticateWithGoogle() {
      this.get('session').authenticate('authenticator:torii', 'google');
    },

    login() {
        this.setProperties({signUp: false, login: true});
    },

    signUp() {
        this.setProperties({signUp: true, login: false});
        let _store = get(this, 'store');
        set(this, 'newLogin', _store.createRecord('login', {}));
    },

    signUpSubmit() {
        get(this, 'newLogin').save();
    },

    cancel() {
        this.setProperties({signUp: false, login: false});
    },
    
    logOut() {
      get(this, 'session').invalidate();
    }
  }
});
