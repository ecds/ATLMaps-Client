import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class LayersRoute extends Route {
  @service fastboot;

  model(params) {
    if (this.fastboot.isFastBoot) {
      return RSVP.hash({
        raster: this.store.query('rasterLayerMeta', { names: params.name }),
        vector: this.store.query('vectorLayerMeta', { names: params.name })
      });

    }
    return RSVP.hash({
      raster: this.store.query('rasterLayer', { names: params.name }),
      vector: this.store.query('vectorLayer', { names: params.name })
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    if (model.raster.length > 0) {
      controller.set('layer', model.raster.firstObject);
      controller.set('type', 'raster');
    } else {
      controller.set('layer', model.vector.firstObject);
      controller.set('type', 'vector');
    }
  }
}
