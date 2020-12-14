import Service from '@ember/service';
import { restartableTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SearchResultsService extends Service {
  @service store;
  @service searchParameters;

  @tracked
  rasters = null; //this.store.query('rasterLayer', this.getSearchParams());
  // rasters = this.setRasters();

  @tracked
  vectors = null; //this.store.query('vectorLayer', this.getSearchParams());

  getSearchParams() {
    const { institution, textSearch, bounds, limit, tags } = this.searchParameters;
    const params = {
      institution,
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
  *getVectors() {
    const params = this.getSearchParams();
    params.page = this.searchParameters.vectorPage;
    this.vectors = yield this.store.query(
      'vectorLayer',
      params
    );
  }

  updateResults() {
    this.getRasters.perform();
    this.getVectors.perform();
  }
}
