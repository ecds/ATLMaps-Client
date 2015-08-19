import DS from 'ember-data';
import ENV from "../config/environment";

export default DS.RESTAdapter.extend({
	host: ENV.APP.API_HOST,
    namespace: 'v1',
    suffix: '.json',
    buildURL: function(record, suffix) {
      var s = this._super(record, suffix);
      return s + this.get('suffix');
    },
});