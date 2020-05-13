import JSONAPISerializer from '@ember-data/serializer/json-api';
import { camelize, underscore } from '@ember/string';
// import camelCaseKeys from 'camelcase-keys';

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(key) {
    return camelize(key);
    // return(key);
  }

  keyForRelationship(key/*, relationship, method*/) {
    return underscore(key);
  }
}
