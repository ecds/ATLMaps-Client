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
    switch (this.args.type) {
      case 'rasters':
        this.searchResults.getRasters.perform();
        break;
      case 'places':
        this.searchResults.getPlaces.perform();
        break;
      case 'data':
        this.searchResults.getData.perform();
    }
  }

  @action
  updateResultsPerPage(event) {
    this.searchParameters.setLimit(event.target.value);
    this.searchResults.updateResults();
  }

}
