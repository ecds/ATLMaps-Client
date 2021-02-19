import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import UIKit from 'uikit';

export default class AccountMenuComponent extends Component {
  @service currentUser;
  @service deviceContext;
  dropdown = null;

  @action
  initDropdown(element) {
    this.dropdown = UIKit.dropdown(element, { mode: 'click' });
  }

  @action
  closeDropdown() {
    this.dropdown.hide();
  }

  @restartableTask
  *updateDisplayName() {
    yield timeout(500);
    yield this.currentUser.user.save();
  }
}
