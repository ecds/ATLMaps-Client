import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';

import UIKit from 'uikit';

export default class ProjectUiExploreInstructionsComponent extends Component {
  @service cookies;
  @service currentUser;
  @service exploreProject;
  @service router;
  @service session;

  @tracked
  cookiesAllowed =  this.cookies.exists('cookieConsent');

  @action
  consent() {
    this.cookies.write('cookieConsent', 'true');
    UIKit.modal('#auth-modal').show();
  }

  @action
  watchForAuth() {
    UIKit.util.on('#auth-modal', 'hide', () => this.saveAndTransition.perform());
  }

  @task
  *saveAndTransition() {
    if (!this.session.isAuthenticated) return;
    this.exploreProject.clearLayers();
    yield timeout(300);
    // Don't set `isExploring` to `false` here.
    // Doing so removes this component and the transition will not fire.
    // `isExploring` is set to `false` via `afterModel` on the `Project` route.
    this.args.project.setProperties({
      user: this.currentUser.user,
      name: 'untitled'
    });
    yield this.args.project.save();
    yield this.args.project.rasters.forEach(raster => {
      raster.save();
    });
    yield this.args.project.vectors.forEach(vector => {
      vector.save();
    });
    this.router.transitionTo('project', this.args.project.id);
  }
}
