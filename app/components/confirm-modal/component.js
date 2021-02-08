import Component from '@glimmer/component';
import UIKit from 'uikit';
import { restartableTask } from 'ember-concurrency-decorators';

export default class ConfirmModalComponent extends Component {
  @restartableTask
  *initModal() {
    try {
      yield UIKit.modal.confirm(this.args.message);
      this.args.onConfirm();
    } catch(e) {
      // Don't really need to do anything.
    }
  }
}
