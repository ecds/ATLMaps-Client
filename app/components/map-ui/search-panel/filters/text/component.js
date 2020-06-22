import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MapUiSearchPanelFiltersTextComponent extends Component {
  @service searchParameters;
  @service searchResults;

  @tracked textToSearch = null;

  @action
  textSearch(event) {
    this.searchParameters.setTextSearch(this.textToSearch);
    this.searchResults.updateResults();
    event.preventDefault();
  }
}
