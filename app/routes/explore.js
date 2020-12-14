import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default class ExploreRoute extends Route {
  @service fastboot;
  @service store;

  beforeModel() {
    if (this.fastboot.isFastBoot) return;
    this.store.unloadAll();
    this.transitionTo('project', 'explore');
  }
}
