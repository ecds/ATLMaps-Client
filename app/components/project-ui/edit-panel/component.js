import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProjectUiEditPanelComponent extends Component {

  @service baseMaps;

  zoomLevels = Array.from({length: (11)}, (v, k) => k + 10);

  @action
  updateZoomLevel(event) {
    this.args.project.setProperties({ zoomLevel: parseInt(event.target.value) });
  }

  @action
  updateBaseMap(event) {
    this.args.project.setProperties({ defaultBaseMap: event.target.value });
  }

  @action
  updateMapDefaults() {
    this.args.project.setProperties(
      {
        centerLat: this.args.project.leafletMap.getCenter().lat,
        centerLng: this.args.project.leafletMap.getCenter().lng,
        zoomLevel: this.args.project.leafletMap.getZoom()
      }
    );
  }
}
