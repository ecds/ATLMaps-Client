export function initialize(applicationInstance) {
  // first we lookup the ember leaflet service
  let emberLeafletService = applicationInstance.lookup('service:ember-leaflet');

  // to support older versions of ember-leaflet that do not include the service, we add a guard here
  if (emberLeafletService) {
    // we then invoke the `registerComponent` method
    emberLeafletService.registerComponent('vector-tile', { as: 'vectorTile' });
  }
}

export default {
  initialize
};