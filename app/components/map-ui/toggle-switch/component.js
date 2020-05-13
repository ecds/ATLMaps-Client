import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MapUiToggleSwitchComponent extends Component {

  @action
  toggleVisible() {
    let layers;
    if (this.args.type.toLowerCase().includes('map')) {
      layers = this.args.project.rasters;
    } else {
      layers = this.args.project.vectors;
    }
    if (this.args.status) {
      layers.forEach(layer => {
        layer.setProperties({ opacity: 100 });
      });
    } else {
      layers.forEach(layer => {
        layer.setProperties({ opacity: 0 });
      });
    }
  }
}
