import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class EmbedRoute extends Route {
  model(params) {
    return RSVP.hash({
      rasters: this.store.query('rasterLayer', { names: params.maps }),
      vectors: this.store.query('vectorLayer', { names: params.maps })
    });
  }
}
