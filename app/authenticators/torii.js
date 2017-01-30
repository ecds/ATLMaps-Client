import Ember from 'ember';
import Torii from 'ember-simple-auth/authenticators/torii';
import ENV from '../config/environment';
/**
 * WTF
 */
const {
    get,
    inject: {
        service
    }
} = Ember;

export default Torii.extend({
    torii: service(),
    ajax: service(),
    session: service(),

    authenticate() {
        const ajax = this.get('ajax');

        return this._super(...arguments).then((data) => {
            const grantType = data.provider === 'password' ? 'password' : `${data.provider}_auth_code`;
            return ajax.request(`${ENV.APP.API_HOST}/token`, {
                type: 'POST',
                dataType: 'json',
                data: {
                    grant_type: grantType,
                    auth_code: data.authorizationCode
                }
            }).then(function(response) {
                return {
                    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                    access_token: response.access_token,
                    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                    provider: data.provider
                };
            });
        });
    },

    logOut() {
        const ajax = get(this, 'ajax');

        return this._super(...arguments.then(function foo() {
            return ajax.request(`${ENV.APP.API_HOST}/revoke`, {
                type: 'POST',
                dataType: 'json',
                data: {
                    token: get(this, 'session.content.authenticated.access_token')
                }
            });
        }));
    }
});
