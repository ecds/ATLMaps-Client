import { Promise as EmberPromise } from 'rsvp';
import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';
import OAuth2Code from 'torii/providers/oauth2-code';
// import { configurable } from 'torii/configuration';
// import { task } from 'ember-concurrency';

/**
 * This class implements a provider allowing authentication against google's
 * authentication server using v2 of google's OAuth2 authentication flow. The
 * user is invited to authenticate in a popup window. Once a token is obtained,
 * it is validated by a second HTTP request (to another url). Authentication is
 * complete once this validation step has succeeded, and the token is returned.
 */
var Ecds = OAuth2Code.extend({

  name:    'ecds',

  baseUrl: 'http://auth.digitalscholarship.emory.edu/auth/',

  tokenValidationUrl: 'https://api.atlmaps-dev.com:3000/auth/verify/',


  redirectUri: 'https://lvh.me:4200/torii/redirect.html',

  /**
   * @method open
   * @return {Promise<object>} If the authorization attempt is a success,
   * the promise will resolve an object containing the following keys:
   *   - authorizationToken: The `token` from the 3rd-party provider
   *   - provider: The name of the provider (i.e., google-oauth2)
   *   - redirectUri: The redirect uri (some server-side exchange flows require this)
   * If there was an error or the user either canceled the authorization or
   * closed the popup window, the promise rejects.
   */
  open(options) {
    console.log("open -> options", options)
    // var name = 'ecds',
    let url = `${this.baseUrl}${options.ecdsProvider}?origin=${this.redirectUri}`;
    // redirectUri = 'https://lvh.me:4200/torii/redirect.html',
    let responseParams = ['access_token'];
    let tokenValidationUrl = this.get('tokenValidationUrl');
        // clientId = '1234';

    // First we go directly to Faux Oauth.
    // Faux OAuth redirects the pop-up to the provider
    return this.get('popup').open(url, responseParams, {}).then(function(authData){
      console.log("open -> responseParams", responseParams)
      console.log("open -> authData", authData)
      // var missingResponseParams = [];

      // responseParams.forEach(function(param){
      //   if (authData[param] === undefined) {
      //     missingResponseParams.push(param);
      //   }
      // });

      // if (missingResponseParams.length){
      //   throw new Error("The response from the provider is missing " +
      //         "these required response params: " +
      //         missingResponseParams.join(', '));
      // }
      if (!authData['access_token']){
        throw new Error("The response from the provider is missing an access token");
      }

      /* at this point 'authData' should look like:
      {
        access_token: '<some long access token string>'
      }
      */

    //  Token validation. For details, see
     return new EmberPromise(function(resolve, reject) {
        //  fetch(tokenValidationUrl, {
        //    method: 'GET',
        //    headers: {
        //      'Content-Type': 'application/json',
        //      'Authorization': `Bearer ${encodeURIComponent(authData['access_token'])}`
        //    }
        //  }).then(response => {
        //    let authData = response.json();
        //    console.log("open -> response", authData);
        //    assign(authData, authData);
        //    return authData;
        //  })
        // Token validation request
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
        xhr.setRequestHeader('Authorization', `Bearer ${encodeURIComponent(authData['access_token'])}`);
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