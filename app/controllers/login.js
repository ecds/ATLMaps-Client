import Ember from 'ember';

export default Ember.Controller.extend({

    session: Ember.inject.service('session'),

    actions: {

        authenticate() {
            //TODO: I don't like any of this.
            // Follow this: http://emberigniter.com/real-world-authentication-with-ember-simple-auth/
            let { identification, password } = this.getProperties('identification', 'password');
            this.get('session').authenticate('authenticator:oauth2', identification, password).catch(() => {
                this.set('errorMessage', 'Invalid email/password combination.');
            });
        }

    }

});
