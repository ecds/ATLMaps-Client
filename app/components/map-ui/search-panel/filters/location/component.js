import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
// import { tracked } from '@glimmer/tracking';

export default class MapUiSearchPanelFiltersLocationComponent extends Component {
  @service searchParameters;
  @service searchResults;

  @action
  toggleBounds() {
    this.searchParameters.setSearchBounds();
    this.searchResults.updateResults();
  }

  @action
  updateBounds() {
    this.searchResults.updateResults();
  }

  @action
  limitToBoundsKey(event) {
    event.preventDefault();
    if(event.key == 'Enter') {
      this.limitToBounds();
    }
  }
}
