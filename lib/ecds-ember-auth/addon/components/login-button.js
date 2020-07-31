import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import UIkit from 'uikit';

export default class LoginButtonComponent extends Component {
  @service session;
  @service store;

  icon = this.icon || null;
  provider = this.provider || null;
  providerTitle = this.providerTitle || this.provider;

  @action
  signin(loginProvider) {
    const options = {
      ecdsProvider: loginProvider
    };

    this.session.authenticate('authenticator:torii', 'ecds', options)
      .then(
        () => {
          // load current user?
          UIkit.modal('#auth-modal').hide();
        },
        error => {
          this.authenticating = false;
          this.session.errorMessage = error.error || error;
        }
      );
  }
}
