import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class EmbedRoute extends Route {
  @service fastboot;

  model(params) {
    if (this.fastboot.isFastBoot) {
      return RSVP.hash({
        rasters: this.store.query('rasterLayerMeta', { names: params.maps }),
        vectors: this.store.query('vectorLayerMeta', { names: params.maps })
      });
      }
    return RSVP.hash({
      rasters: this.store.query('rasterLayer', { names: params.maps }),
      vectors: this.store.query('vectorLayer', { names: params.maps })
    });
  }
}
