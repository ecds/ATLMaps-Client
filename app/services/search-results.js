import Service from '@ember/service';
import { enqueueTask, restartableTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SearchResultsService extends Service {
  @service store;
  @service searchParameters;

  @tracked
  rasters = null; //this.store.query('rasterLayer', this.getSearchParams());

  @tracked
  places = null;

  @tracked
  data = null;

  @tracked
  vectors = null; //this.store.query('vectorLayer', this.getSearchParams());

  getSearchParams() {
    const { institutions, textSearch, bounds, limit, tags } = this.searchParameters;
    const params = {
      institutions,
      bounds,
      limit,
      tags,
      'text_search': textSearch,
      search: true
    };
    Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
    return params;
  }

  @restartableTask
  *getRasters() {
    const params = this.getSearchParams();
    params.page = this.searchParameters.rasterPage;
    this.rasters = yield this.store.query(
      'rasterLayer',
      params
    );
  }

  @restartableTask
  *getPlaces() {
    let params = this.getSearchParams();
    params.page = this.searchParameters.placePage;
    params.type = 'qualitative';
    this.places = yield this.store.query(
      'vectorLayer',
      params
    );
  }

  @restartableTask
  *getData() {
    let params = this.getSearchParams();
    params.page = this.searchParameters.dataPage;
    params.type = 'quantitative';
    this.data = yield this.store.query(
      'vectorLayer',
      params
    );
  }

  @enqueueTask
  *getVectors() {
    yield this.getPlaces.perform();
    yield this.getData.perform();
  }

  updateResults() {
    this.getRasters.perform();
    this.getVectors.perform();
  }
}
