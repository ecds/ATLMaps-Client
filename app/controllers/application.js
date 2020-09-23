import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @service ecdsSession;

  @action
  signOut() {
    this.ecdsSession.invalidate();
  }
}
