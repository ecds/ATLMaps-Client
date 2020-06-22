import Service from '@ember/service';
import { computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class SearchParametersService extends Service {
  // bounds = this.formatBounds();
  @tracked rasterPage = 0;
  @tracked vectorPage = 0;
  @tracked limit = '50';
  @tracked textSearch = null;
  @tracked institution = null;
  @tracked searchBounds = false;
  @tracked currentBounds = null;
  @tracked filteredBounds = null;
  @tracked tags = A([]);

  @computed('currentBounds', 'searchBounds')
  get bounds() {
    if (this.currentBounds && this.searchBounds) {
      this.filteredBounds = this.currentBounds;
      return {
        s: this.currentBounds.getSouth(),
        n: this.currentBounds.getNorth(),
        e: this.currentBounds.getEast(),
        w: this.currentBounds.getWest()
      };
    } else {
      return null;
    }
  }

  @computed('bounds', 'currentBounds', 'filteredBounds', 'searchBounds')
  get updateBounds() {
    if (this.filteredBounds == null || this.searchBounds == false) return false;
    return this.filteredBounds != this.currentBounds;
  }

  setOffset(offset, type) {
    if (type == 'rasters') {
      this.rasterPage = offset;
    } else {
      this.vectorPage = offset;
    }
  }

  setSearchBounds() {
    this.searchBounds = !this.searchBounds;
  }

  setTextSearch(textSearch) {
    this.textSearch = textSearch;
  }

  updateTags(tag) {
    if (tag.checked) {
      this.tags.pushObject(tag.slug);
    } else {
      this.tags.removeObject(tag.slug);
    }
  }
}
