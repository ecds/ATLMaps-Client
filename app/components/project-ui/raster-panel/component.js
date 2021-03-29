import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import UIKit from "uikit";

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
      if (this.args.project.mayEdit) {
        layer.save();
      }
    }
    this.saveOrder();
  }

  @action
  initUkSortable(element) {
    this.ukSortable = UIKit.sortable(
      element,
      {
        handle: '.atlm-grip',
        animation: 150
      }
    );

    UIKit.util.on(this.ukSortable.$el, 'moved', event => {
      this.reorder(event.target.children);
    });

    this.ukAccordion = UIKit.accordion(
      element,
      {
        toggle: '> > .uk-accordion-title',
        animation: false
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
    }
    this.saveOrder();
  }

  saveOrder() {
    if (this.args.project.mayEdit) {
      this.args.project.rasters.forEach(raster => {
        raster.save();
      });
    }
  }
}
