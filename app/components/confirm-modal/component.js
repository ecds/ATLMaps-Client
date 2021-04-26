import Component from '@glimmer/component';
import UIKit from 'uikit';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';

export default class ConfirmModalComponent extends Component {
  confirmModal = null;

  // Slight delay when opening modal on insert.
  @task
  *delayModal() {
    yield timeout(300);
    yield this.initModal.perform();
  }

  @restartableTask
  *initModal() {
    try {
      yield UIKit.modal.confirm(this.args.message);
      this.args.onConfirm();
    } catch(e) {
      if (this.args.onCancel) {
        this.args.onCancel();
      }
    }
    return true;
  }
}
