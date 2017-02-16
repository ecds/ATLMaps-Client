import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from '../config/environment';

const { RESTAdapter } = DS;

export default RESTAdapter.extend(DataAdapterMixin, {
    host: ENV.APP.API_HOST,
    namespace: 'v1',
    suffix: '.json',
    coalesceFindRequests: true,
    authorizer: 'authorizer:oauth2',
    buildURL: function buildURL(record, suffix) {
        const s = this._super(record, suffix);
        return s + this.get('suffix');
    }
});
