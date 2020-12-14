import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
// import L from 'leaflet';

export default class LayersController extends Controller {
  @service baseMaps;

  @tracked activeFeature = null;
  @tracked opacity = 100;

  layer = null;
  type = null;

  @computed('layer.latLngBounds')
  get center() {
    if (this.layer) {
      return this.layer.latLngBounds;
    }
    return [[0, 0], [1, 1]];
  }

  @computed('opacity')
  get calculatedOpacity() {
    return this.opacity * 0.01;
  }

  @action
  onEachFeature(feature, layer) {
    feature.properties.id = Math.random().toString(36).substring(7);
    layer.on('click', () => {
      this.activeFeature = feature;
    });
  }
}
