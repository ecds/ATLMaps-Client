import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  async checkCurrentUser() {
    if (!this.session.isAuthenticated) return null;
    try {
      let response = await fetch('https://api.atlmaps-dev.com:3000/users/me', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      });

      if (response.ok) {
        let user = await response.json();
        if (!user) {
          this.session.session.invalidate();
        }
      } else {
        this.session.session.invalidate();
      }
    } catch(error) {
      console.log(error);
    } finally {
      // reload model?
    }
  }
}
