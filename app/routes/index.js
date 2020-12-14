import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';

export default class IndexRoute extends Route {
  @service fastboot;

  async model() {
    return this.store.findAll('project');
  }

  @action
  didTransition() {
    if (this.fastboot.isFastBoot) return;
    console.log(this.fullRouteName)
    this.scrollToAbout.perform();
  }

  @task
  *scrollToAbout() {
    yield timeout(500);
    if (window.location.href.split('/').reverse()[0] == 'about') {
      const aboutEl = document.getElementById('about-anchor');
      aboutEl.scrollIntoView();
      window.scrollBy(0, -80);
    }
  }
}
