// TODO: Have this extend the ESA session service.
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';

export default class EcdsSessionService extends Service {
  @service session;

  invalidate() {
    const { tokenAuthUrl } = getOwner(this).resolveRegistration('config:environment').fauxOAuth;

    fetch(
      tokenAuthUrl,
      {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include'
      }
    );

    return this.session.invalidate();
  }

}
