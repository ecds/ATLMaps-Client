import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'atlmaps-client/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  // namespace = 'v1';
  host = ENV.APP.API_HOST;
  
}
