import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MapUiSearchPanelPaginationComponent extends Component {

  // Array.from({length:10},(v,k)=>(k+1))

  @service searchResults;
  @service searchParameters;

  options = ['25', '50', '100', '200'];

  @action
  setOffset(offset) {
    this.searchParameters.setOffset(parseInt(offset), this.args.type);
    this.searchParameters.setOffset(offset, this.args.type);
    if (this.args.type == 'rasters') {
      this.searchResults.getRasters.perform();
    } else {
      this.searchResults.getVectors.perform();
    }
  }

  @action
  updateResultsPerPage(event) {
    this.searchParameters.setLimit(event.target.value);
    this.searchResults.updateResults();
  }

}
