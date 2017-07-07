import Ember from 'ember';

const {
    get,
    run,
    set,
    inject: {
        service
    },
    Component
} = Ember;

export default Component.extend({
    session: service(),
    currentUser: service(),
    ajax: service(),
    store: service(),
    flashMessage: service(),
    classNames: ['login-form'],

    newLogin: {},

    accountCreated: false,

    signUp: false,

    showingPassword: false,

    authenticating: false,

    actions: {
        authenticateWithOAuth2() {
            set(this, 'authenticating', true);
            const {
                identification,
                password
            } = this.getProperties('identification', 'password');
            this.get('session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
                this.set('errorMessage', reason.error || reason);
            });
        },

        authenticateWithFacebook() {
            set(this, 'authenticating', true);
            this.get('session').authenticate('authenticator:torii', 'facebook').then(() => {
                set(this, 'authenticating', false);
                get(this, 'currentUser').load();
            }, (e) => {
                this.set('authenticating', false);
                this.set('errorMessage', e.error || e);
            });
        },

        authenticateWithGoogle() {
            set(this, 'authenticating', true);
            this.get('session').authenticate('authenticator:torii', 'google').then(() => {
                set(this, 'authenticating', false);
                get(this, 'currentUser').load();
            }, (e) => {
                this.set('authenticating', false);
                this.set('errorMessage', e.error || e);
            });
        },

        startSignUp() {
            set(this, 'signUp', true);
            set(this, 'newLogin', get(this, 'store').createRecord('login', {}));
        },

        abortSignUp() {
            set(this, 'signUp', false);
            get(this, 'store').unloadAll('login');
        },

        signUpSubmit() {
            get(this, 'newLogin').save().then(() => {
                set(this, 'accountCreated', true);
                run.later(this, () => {
                    // maybe we can not redirect
                }, () => {
                    // Error callback
                    run.later(this, () => {
                        // clear
                    }, 3000);
                });
            }, 300);
        },

        cancel() {
            this.setProperties({
                signUp: false,
                login: false
            });
        },

        logOut() {
            get(this, 'session').invalidate();
        }
    }
});
