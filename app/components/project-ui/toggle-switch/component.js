import Component from '@glimmer/component';
import { action } from '@ember/object';
import { keyResponder, onKey } from 'ember-keyboard';

@keyResponder
export default class ProjectUiToggleSwitchComponent extends Component {

  @action
  toggleVisible() {
    if (this.args.project.allLayersHidden) {
      this.args.project.rasters.forEach(layer => {
        layer.get('rasterLayer').setProperties({ opacity: 100 });
      });
      this.args.project.vectors.forEach(vector => {
        vector.vectorLayer.setProperties({ show: true, opacity: 40 });
      });
    } else {
      this.args.project.rasters.forEach(layer => {
        layer.get('rasterLayer').setProperties({ opacity: 0 });
      });
      this.args.project.vectors.forEach(vector => {
        vector.vectorLayer.setProperties({ show: false, opacity: 0 });
      });
    }
  }

  @onKey('alt+shift+KeyC')
  toggleByKey() {
    this.toggleVisible();
  }
}
