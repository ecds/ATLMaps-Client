import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	host: 'http://atlmaps-dev.com:7000',
    namespace: 'v1',
    suffix: '.json',
    buildURL: function(record, suffix) {
      var s = this._super(record, suffix);
      return s + this.get('suffix');
    },
});