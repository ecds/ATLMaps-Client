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

  @tracked
  base = null

  @tracked
  leafletMap = null;

  @tracked
  showDropDown = false;

  @tracked
  bounds = [[0, 0], [0, 0]];

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

  @enqueueTask
  *layerAdded(layer) {
    // It's probably a timing issue, but this will not work
    // using the layer's `latLngBounds` attribute.
   this.bounds.extend([
     [layer.maxy, layer.maxx],
     [layer.miny, layer.minx]
   ]);
   this.leafletMap.fitBounds(this.bounds);
   yield timeout(300);
  }
}
