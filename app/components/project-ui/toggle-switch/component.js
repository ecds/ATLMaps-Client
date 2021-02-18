import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ProjectUiToggleSwitchComponent extends Component {

  @action
  initToggle() {
    // console.log(this)
  }

  @action
  toggleVisible() {
    // let layers = this.args.project.rasters;

    if (this.args.project.allLayersHidden) {
      this.args.project.rasters.forEach(layer => {
        layer.setProperties({ opacity: 100 });
      });
      this.args.project.vectors.forEach(vector => {
        vector.vectorLayer.setProperties({ show: true, opacity: 40 });
      });
    } else {
      this.args.project.rasters.forEach(layer => {
        layer.setProperties({ opacity: 0 });
      });
      this.args.project.vectors.forEach(vector => {
        vector.vectorLayer.setProperties({ show: false });
      });
    }
  }
}
