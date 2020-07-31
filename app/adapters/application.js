import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'atlmaps-client/config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;
  @service fastboot;

  host = ENV.APP.API_HOST;

  @computed('session.data.authenticated.access_token')
  get headers(){
    if (this.fastboot.isFastBoot) return null;
    if (!this.session.isAuthenticated) return null;

    let headers = {};
    headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    return headers;
  }
}
