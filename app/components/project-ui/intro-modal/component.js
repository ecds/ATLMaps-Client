import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import UIkit from 'uikit';

export default class MapUiIntroModalComponent extends Component {
  @service cookies;

  hideCookieName = `hideIntroFor-${this.args.project.id}`;

  introModal = this.introModal | null;

  @computed
  get hideIntro() {
    return this.cookies.exists(this.hideCookieName);
  }

  set hideIntro(set) {
    return set;
  }

  @action
  initModal(element) {
    let modalOptions = {};
    if (this.args.isTesting) {
      modalOptions.container = '#container';
    }
      this.introModal = UIkit.modal(element, modalOptions);
      this.args.project.setProperties({ introModal: this.introModal });
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
