import { inject as service } from '@ember/service';
import Torii from 'ember-simple-auth/authenticators/torii';
import config from '../config/environment';

export default class ToriiAuthenticator extends Torii {
  @service torii;

  async authenticate() {
    // const tokenExchangeUri = config.torii.providers['github-oauth2'].tokenExchangeUri;
    let data = await super.authenticate(...arguments);
    const response = await fetch('https://api.atlmaps-dev.com:3000/auth/tokens', {
      // Adding method type
      method: 'GET',
      // no-cors, *cors, same-origin
      mode: 'cors',
      // // Adding body or contents to send
      // body: JSON.stringify({
      //   authorizationCode: data.authorizationCode
      // }),
      // Adding headers to the request
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.access_token}`,
      }
    });

    let respData = await response.json();

    console.log("ToriiAuthenticator -> authenticate -> JSON.parse(response)", respData.data.attributes.token)
    let _session = {
      access_token: respData.data.attributes.token,
      provider: 'ecds'
    };
    console.log("ToriiAuthenticator -> authenticate -> _session", _session)

    return _session;
  }
}