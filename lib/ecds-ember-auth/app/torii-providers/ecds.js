import { Promise as EmberPromise } from 'rsvp';
import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';
import { getOwner } from '@ember/application';
import OAuth2Code from 'torii/providers/oauth2-code';

/**
 * This class implements a provider allowing authentication against google's
 * authentication server using v2 of google's OAuth2 authentication flow. The
 * user is invited to authenticate in a popup window. Once a token is obtained,
 * it is validated by a second HTTP request (to another url). Authentication is
 * complete once this validation step has succeeded, and the token is returned.
 */

var Ecds = OAuth2Code.extend({


  name:    'ecds',


  /**
   * @method open
   * @return {Promise<object>} If the authorization attempt is a success,
   * the promise will resolve an object containing the following keys:
   *   - authorizationToken: The `token` from the 3rd-party provider
   *   - provider: The name of the provider (i.e., google-oauth2)
   *   - redirectUrl: The redirect uri (some server-side exchange flows require this)
   * If there was an error or the user either canceled the authorization or
   * closed the popup window, the promise rejects.
   */
  open(options) {
    const { baseUrl, tokenValidationUrl, redirectUrl } = getOwner(this).resolveRegistration('config:environment').fauxOAuth;

    let url = `${baseUrl}${options.ecdsProvider}?origin=${redirectUrl}`;
    let responseParams = ['access_token'];

    // First we go directly to Faux Oauth.
    // Faux OAuth redirects the pop-up to the provider
    return this.get('popup').open(url, responseParams, {}).then(function(authData){
      if (!authData['access_token']){
        throw new Error("The response from the provider is missing an access token");
      }

      /* at this point 'authData' should look like:
      {
        access_token: '<some long access JWT from FauxOAuth>'
      }
      */

      // TODO: Refactor to use fetch for consistency.
      return new EmberPromise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
          authData = JSON.parse(xhr.responseText);
          run(() => resolve(assign(authData, authData)));
        };
        xhr.onerror = function() {
          // authentication failed because the validation request failed
          run(() => reject(new Error(`Token validation request failed with status '${xhr.statusText}' (server '${tokenValidationUrl}' '${xhr.responseText}').`)));
        };
        // Authenticate to the web app/API host.
        xhr.open('GET', `${tokenValidationUrl}`);
        // Send to FauxOauth JWT as an authorization header for validation by the api service.
        xhr.setRequestHeader('Authorization', `Bearer ${encodeURIComponent(authData['access_token'])}`);
        xhr.withCredentials = true;
        xhr.send();
      });
    });
  },

  fetch(authenticationData) {
    // this is the most basic for ember-simple-auth to work with this provider,
    // but the session could actually be checked and renewed here if the token
    // is too old.
    return authenticationData;
  }
});

export default Ecds;