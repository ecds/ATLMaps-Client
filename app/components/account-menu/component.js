import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import UIKit from 'uikit';

export default class AccountMenuComponent extends Component {
  @service currentUser;
  @service deviceContext;
  @service fastboot;
  dropdown = null;

  @action
  initDropdown(element) {
    if (this.fastboot.isFastBoot) return;
    this.dropdown = UIKit.dropdown(element, { mode: 'click' });
  }

  @action
  closeDropdown() {
    if (this.fastboot.isFastBoot) return;
    this.dropdown.hide();
  }

  @restartableTask
  *updateDisplayName() {
    if (this.fastboot.isFastBoot) return;
    yield timeout(500);
    yield this.currentUser.user.save();
  }
}
