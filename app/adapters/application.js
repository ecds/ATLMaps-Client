import DS from 'ember-data';
import ENV from '../config/environment';

const { RESTAdapter } = DS;

import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default RESTAdapter.extend(DataAdapterMixin, {
    host: ENV.APP.API_HOST,
    namespace: 'v1',
    suffix: '.json',
    authorizer: 'authorizer:oauth2',
    buildURL: function(record, suffix) {
        let s = this._super(record, suffix);
        return s + this.get('suffix');
    }
});
