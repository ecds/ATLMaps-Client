// TODO This must be burned to the ground!
import Ember from 'ember';

const {
    Controller,

    inject: {
        service
    }

} = Ember;

export default Controller.extend({

    session: service(),

    actions: {

        authenticate() {
            // TODO I do not like any of this.
            // Follow this: http://emberigniter.com/real-world-authentication-with-ember-simple-auth/
            let { identification, password } = this.getProperties('identification', 'password');
            this.get('session').authenticate('authenticator:oauth2', identification, password).catch(() => {
                this.set('errorMessage', 'Invalid email/password combination.');
            });
        }

    }

});
