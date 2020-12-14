import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import UIkit from "uikit";

export default class MapUiVectorPanelComponent extends Component {
  @tracked vectorToEdit = false;

  ukAccordion = null;

  @action
  initInteraction(element) {
    this.ukAccordion = UIkit.accordion(element, {
      toggle: '> > .uk-accordion-title'
    });
  }

  @action
  bringToFront(vectorLayerProject) {
    const project = vectorLayerProject.get('project');
    project.get('vectors').forEach(vector => {
      if (vector == vectorLayerProject) {
        vector.setProperties({ order: 1 });
      } else {
        vector.setProperties({ order: vector.order + 1 });
      }
      // if (vector.leafletPane) {
      //   vector.leafletPane.style.zIndex = 500 - (vector.order * 10);
      // }
    });
  }

/**
 *
 * @memberof MapUiVectorPanelComponent
 * This is a little hacky. We add the `.1` so that the property changes and updates the
 * `show` property on the `vectorLayerProject` objects.
 */
  @action
  showLayer(layer) {
    if (layer.get('geometryType') == 'MultiPolygon') {
      layer.setProperties({ opacity: 30.1 });
    } else {
      layer.setProperties({ opacity: 100.1 });
    }
  }

  @action
  editLayerColors(vector) {
    this.vectorToEdit = { vectorProject: vector, vectorLayer: vector.vectorLayer };
  }

  @action
  updatePointColor(vector) {
    vector.get('vectorLayer.vectorFeatures').forEach( feature => {
      feature.setProperties({ style: `color: ${vector.color};`});
      // Not sure why we have to call `divIcon` to get the icon on the map to update.
      feature.divIcon;
    });
  }

  @action
  saveColor(vector) {
    vector.save();
  }

  @action
  cancelEdit() {
    this.vectorToEdit = null;
  }
}
