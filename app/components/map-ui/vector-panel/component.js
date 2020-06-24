import Component from '@glimmer/component';
import { action } from '@ember/object';
import UIkit from "uikit";

export default class MapUiVectorPanelComponent extends Component {

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
    if (layer.get('dataType') == 'MultiPolygon') {
      layer.setProperties({ opacity: 30.1 });
    } else {
      layer.setProperties({ opacity: 100.1 });
    }
  }
}
