import Component from '@glimmer/component';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class EcdsAuthComponent extends Component {
  @service store

  models = this.args.modelsToReload || A([]);

  providers = A([
    // {
    //   provider: 'emory',
    //   service: 'shibboleth',
    //   icon: 'icon-emory_shield'
    // },
    {
      provider: 'google',
      service: 'google_oauth2'
    },
    {
      provider: 'facebook'
    },
    {
      provider: 'github'
    },
    {
      provider: 'twitter'
    }
  ]);

  @action
  reloadModels() {
    this.models.forEach(model => {
      this.store.peekAll(model).forEach(record => {
        if (record.id) {
          record.reload();
        }
      });
    });
  }
}
