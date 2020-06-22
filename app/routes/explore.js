import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class ExploreRoute extends Route {
  model() {
    return RSVP.hash({
      rasters: this.store.findAll('rasterLayer'),
      vectors: this.store.findAll('vectorLayer')
    });
  }
}
