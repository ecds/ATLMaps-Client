import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MapUiToggleSwitchComponent extends Component {

  @action
  initToggle() {
    // console.log(this)
  }

  @action
  toggleVisible() {
    let layers = this.args.project.rasters;

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
