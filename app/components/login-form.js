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

    signUp: false,

    actions: {
        authenticateWithOAuth2() {
            const {
                identification,
                password
            } = this.getProperties('identification', 'password');
            this.get('session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
                this.set('errorMessage', reason.error || reason);
            });
        },

        authenticateWithFacebook() {
            this.get('session').authenticate('authenticator:torii', 'facebook');
        },

        authenticateWithGoogle() {
            this.get('session').authenticate('authenticator:torii', 'google');
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
                set(this, 'signUp', false);
                set(self, 'flashMessage.message', 'Login Created');
                set(self, 'flashMessage.success', true);
                set(self, 'flashMessage.show', true);
                // self.toggleProperty('flashMessage.showing');
                run.later(this, () => {
                    set(self, 'flashMessage.message', '');
                    set(self, 'flashMessage.show', false);
                    set(self, 'flashMessage.success', true);
                    // self.toggleProperty('flashMessage.showing');
                }, () => {
                    // TODO figure out how to give feedback on these shared actions
                    set(self, 'flashMessage.message', 'Oh no! We were unable to create your user <i class="material-icons">sentiment_dissatisfied</i>');
                    set(self, 'flashMessage.show', true);
                    set(self, 'flashMessage.success', false);

                    run.later(this, () => {
                        set(self, 'flashMessage.message', '');
                        set(self, 'flashMessage.show', false);
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
