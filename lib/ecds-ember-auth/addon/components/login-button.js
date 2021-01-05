import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import UIkit from 'uikit';

export default class LoginButtonComponent extends Component {
  @service session;

  @action
  signin() {
    const options = {
      ecdsProvider: (this.args.provider.service ? this.args.provider.service : this.args.provider.provider)
    };

    this.session.authenticate('authenticator:torii', 'ecds', options)
      .then(
        () => {
          // load current user?
          UIkit.modal('#auth-modal').hide();
          // Update models
          this.args.reloadModels();
        },
        error => {
          this.authenticating = false;
          this.session.errorMessage = error.error || error;
        }
      );
  }
}
