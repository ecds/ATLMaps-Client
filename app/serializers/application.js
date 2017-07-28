// app/serializers/application.js
import Ember from 'ember';
import DS from 'ember-data';

const {
    JSONAPISerializer
} = DS;
const {
    String: {
        underscore
    }
} = Ember;

export default JSONAPISerializer.extend({
    keyForAttribute: function remvoeDashes(attr) {
        return underscore(attr);
    },

    keyForRelationship: function remvoeDashes(rawKey) {
        return underscore(rawKey);
    }
});
