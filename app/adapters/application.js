import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'atlmaps-client/config/environment';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;
  @service fastboot;

  host = ENV.APP.API_HOST;

  /* eslint-disable no-unused-vars */
  ajaxOptions(defaultOptions, adapter) {
    const options = super.ajaxOptions(...arguments);
    options.credentials = 'include';

    return options;
  }
  /* eslint-enable no-unused-vars */
}
