import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  async checkCurrentUser() {
    if (!this.session.isAuthenticated) return null;
    let response = await fetch('https://api.atlmaps-dev.com:3000/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.session.data.authenticated.access_token}`
      }
    });

    let user = await response.json();
    if (!user) {
      this.session.session.invalidate();
    }
  }
}
