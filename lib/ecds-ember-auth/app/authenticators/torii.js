import { inject as service } from '@ember/service';
import Torii from 'ember-simple-auth/authenticators/torii';
import { getOwner } from '@ember/application';

export default class ToriiAuthenticator extends Torii {
  @service torii;


  async authenticate() {
    const { tokenAuthUrl } = getOwner(this).resolveRegistration('config:environment').fauxOAuth;
    // const tokenExchangeUri = config.torii.providers['github-oauth2'].tokenExchangeUri;
    await super.authenticate(...arguments);
    const response = await fetch(tokenAuthUrl, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    });

    let respData = await response.json();

    let _session = {
      access_token: respData.token,
      provider: 'ecds'
    };

    return _session;
  }
}