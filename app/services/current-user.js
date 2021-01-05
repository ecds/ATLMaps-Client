import Service from '@ember/service';
import { inject as service } from '@ember/service';
import ENV from 'atlmaps-client/config/environment';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  user = this.user || null;

  async setCurrentUser() {
    if (!this.session.isAuthenticated) return null;
    let user = null;
    try {
      let response = await fetch(`${ENV.APP.API_HOST}/users/me`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      });

      if (response.ok) {
        user = await response.json();
        if (!user) {
          this.session.session.invalidate();
        }
      } else {
        this.session.session.invalidate();
      }
    } catch(error) {
      // Do Something?
    } finally {
      // reload model?
    }
    this.user = this.store.createRecord('user', user.data);
    return this.user;
  }
}
