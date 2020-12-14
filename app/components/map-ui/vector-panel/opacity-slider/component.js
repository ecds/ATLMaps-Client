import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MapUiVectorPanelOpacitySliderComponent extends Component {
  @action
  updateOpacity(event) {
    if (this.args.vector.get('vectorLayer.dataFormat') != 'pbf') return;

    this.args.vector.vectorTileStyles.forEach( feature => {
      feature.style.fillOpacity = event.target.value / 100;
      this.args.vector.get('vectorLayer.leafletObject').setFeatureStyle(
        feature.id,
        feature.style
      );
    });
  }
}
