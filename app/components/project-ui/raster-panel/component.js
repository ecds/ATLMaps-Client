import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import UIkit from "uikit";

export default class ProjectUiRasterPanelComponent extends Component {
  @service store;

  ukSortable = null;
  ukAccordion = null;

  reorder(layers) {
    let index = 1;
    for (let item of layers) {
      const layer = this.store.peekRecord('rasterLayerProject', item.attributes['data-layer'].value);
      layer.setProperties({ position: layers.length - index + 11 });
      index += 1;
    }
  }

  @action
  initUkSortable(element) {
    this.ukSortable = UIkit.sortable(
      element,
      {
        handle: '.atlm-grip',
        animation: 150
      }
    );

    UIkit.util.on(this.ukSortable.$el, 'moved', event => {
      this.reorder(event.target.children);
    });

    this.ukAccordion = UIkit.accordion(
      element,
      {
        toggle: '> > .uk-accordion-title'
      }
    );
  }

  @action
  keyboardReorder(raster, direction, event) {
    if (event.key == 'Enter' || event.type == 'click') {
      // const layers = document.getElementsByClassName('atlm-layer-list-item');
      if (direction == 'up') {
        const rasterDown = this.args.project.rasters.filterBy('position', raster.position + 1).findBy('isDeleted', false);
        raster.setProperties({
          position: rasterDown.position
        });
        rasterDown.setProperties({
          position: rasterDown.position - 1
        });
      } else {
        const rasterUp = this.args.project.rasters.filterBy('position', raster.position - 1).findBy('isDeleted', false);
        raster.setProperties({
          position: rasterUp.position
        });
        rasterUp.setProperties({
          position: rasterUp.position + 1
        });
      }
      // for (let layer of layers) {
      //   if (direction == 'up') {
      //     if (layer.attributes['data-position'].value == raster.position + 1) {
      //       const layerDown = this.store.peekRecord('raster-layer-project', layer.attributes['data-layer'].value);
      //       layerDown.setProperties({ position: raster.position});
      //       raster.setProperties({ position: raster.position + 1 });
      //     }
      //   } else if (direction == 'down') {
      //     if (layer.attributes['data-position'].value == raster.position - 1) {
      //       const layerUp = this.store.peekRecord('raster-layer-project', layer.attributes['data-layer'].value);
      //       layerUp.setProperties({ position: raster.position});
      //       raster.setProperties({ position: raster.position - 1 });
      //       break;
      //     }
      //   }
      // }
    }
  }
}
