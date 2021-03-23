import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import UIKit from 'uikit';

export default class ProjectUiIntroModalComponent extends Component {
  @service cookies;

  hideCookieName = `hideIntroFor-${this.args.project.id}`;

  @tracked
  introModal = null;

  @tracked showingModal = true;

  @computed
  get hideIntro() {
    return this.cookies.exists(this.hideCookieName) || this.args.project.mayEdit;
  }

  set hideIntro(set) {
    return set;
  }

  @computed
  get cookieConsent() {
    return this.cookies.exists('cookieConsent');
  }

  @action
  initModal(element) {
    let modalOptions = {};
    if (this.args.isTesting) {
      modalOptions.container = '#container';
    }
    this.introModal = UIKit.modal(element, modalOptions);

    UIKit.util.on(this.introModal.$el, 'beforehide', () => this.showingModal = false);
    UIKit.util.on(this.introModal.$el, 'shown', () => this.showingModal = true);

    if (!this.hideIntro) {
      this.introModal.show();
    }

  }

  @action
  toggleHideCookie() {
    this.hideIntro = !this.hideIntro;
    if (this.hideIntro) {
      this.cookies.write(this.hideCookieName, 'yup');
    } else {
      this.cookies.clear(this.hideCookieName);
    }
  }
}
