import JSONAPISerializer from '@ember-data/serializer/json-api';
import { underscore } from '@ember/string';

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(key) {
    return underscore(key);
  }

  keyForRelationship(key/*, relationship, method*/) {
    return underscore(key);
  }

  // extractMeta(store, typeClass, payload) {
  //   console.log("ApplicationSerializer -> extractMeta -> store, typeClass, payload", store, typeClass, payload);
  // }
}
