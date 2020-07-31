import ApplicationSerializer from './application';

export default class ProjectSerializer extends ApplicationSerializer {

  serializeAttribute(snapshot, json, key, attribute) {
    if (attribute.name == 'leafletMap') return;
    return super.serializeAttribute(...arguments);
  }
}

