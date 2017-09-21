import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from '../config/environment';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {
    host: ENV.APP.API_HOST,
    suffix: '.json',
    coalesceFindRequests: true,
    authorizer: 'authorizer:oauth2',
    buildURL: function buildURL(record, suffix) {
        const s = this._super(record, suffix);
        return s + this.get('suffix');
    }
});
