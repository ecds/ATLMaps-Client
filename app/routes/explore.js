import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default class ExploreRoute extends Route {
  @service fastboot;

  beforeModel() {
    if (this.fastboot.isFastBoot) return;
    this.transitionTo('project', 'explore');
  }
}
