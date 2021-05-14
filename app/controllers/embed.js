import Controller from '@ember/controller';
import ENV from 'atlmaps-client/config/environment';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { enqueueTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';

export default class EmbedController extends Controller {
  @service baseMaps;
  @service fastboot;

  queryParams = ['base', 'color'];

  link = ENV.APP.HOST;

  @tracked
  base = null;

  @tracked
  color = '#1e88e5';

  @tracked
  leafletMap = null;

  @tracked
  showDropDown = false;

  @tracked
  bounds = [[0, 0], [0, 0]];

  @tracked
  activeFeature = null;

  lat = ENV.APP.CENTER_LAT;
  lng = ENV.APP.CENTER_LNG;
  zoom = ENV.APP.INITIAL_ZOOM;

  get baseLayer() {
    return this.baseMaps[this.base] || this.baseMaps[ENV.APP.DEFAULT_BASE_MAP];
  }

  @action
  initMap(event) {
    if (this.fastboot.isFastBoot) return;
    this.leafletMap = event.target;
    this.leafletMap.zoomControl.setPosition('bottomleft');
    this.bounds = this.leafletMap.getBounds();
  }

  @action
  setIcon(vectorFeature, layer, feature) {
    vectorFeature.setProperties({ geometry: feature, color: this.color });
    vectorFeature.leafletMarker.setIcon(vectorFeature.divIcon);
    return vectorFeature.leafletMarker;
  }

  @action
  onEachFeature(vectorFeature, leafletFeature, leafletLayer) {
    leafletLayer.on('click', () => {
      this.clearActiveFeature();
      vectorFeature.setProperties({ active: true });
      vectorFeature.divIcon;
      this.activeFeature = vectorFeature;
    });
  }

  @action
  clearActiveFeature() {
    if (this.activeFeature) {
      this.activeFeature.setProperties({
        active: false
      });
      this.activeFeature.get('divIcon');
    }
    this.activeFeature = null;
  }

  @enqueueTask
  *layerAdded(layer) {
    // It's probably a timing issue, but this will not work
    // using the layer's `latLngBounds` attribute.
   this.bounds.extend([
     [layer.maxy, layer.maxx],
     [layer.miny, layer.minx]
   ]);
   this.leafletMap.fitBounds(this.bounds);
   yield timeout(3);
  }
}
