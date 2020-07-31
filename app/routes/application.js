import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service currentUser;
  @service session;
  @service fastboot;

  afterModel(/* model, transition */) {
    this.currentUser.checkCurrentUser();
  }
}
