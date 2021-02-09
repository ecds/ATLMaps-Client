import Service from '@ember/service';
import { inject as service } from '@ember/service';
import ENV from 'atlmaps-client/config/environment';
import { tracked } from '@glimmer/tracking';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  @tracked user = null;

  constructor() {
    super(...arguments);
    if (!this.user) {
      this.setCurrentUser();
    }
  }

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
          this._invalidateSession();
        } else {
          this.user = await this.store.findRecord('user', user.data.id);
          // console.log("🚀 ~ file: current-user.js ~ line 35 ~ CurrentUserService ~ setCurrentUser ~ this.user", this.user)
        }
      } else {
        this._invalidateSession();
      }
    } catch(error) {
      // Do Something?
    } finally {
      // reload model?
    }
    return this.user;
  }

  _invalidateSession() {
    this.session.session.invalidate();
    this.store.unloadAll('user');
    this.user = null;
  }
}
