import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { tracked } from '@glimmer/tracking';

export default class ProjectUiSearchPanelFiltersProvidersComponent extends Component {
  @service searchParameters;
  @service searchResults;
  @service store;

  @tracked
  selectedInstitutions = A([]);

  @action
  selectProvider(event) {
    const selectBox = event.target;
    const provider = this.store.peekRecord('institution', selectBox.value);
    provider.setProperties({ selected: !provider.selected });
    if (this.selectedInstitutions.includes(provider)) {
      this.selectedInstitutions.removeObject(provider);
    } else {
      this.selectedInstitutions.pushObject(provider);
    }
    this.updateSearch();
    selectBox.value = '';
  }

  @action
  removeProvider(provider) {
    provider.setProperties({ selected: false });
    this.selectedInstitutions.removeObject(provider);
    this.updateSearch();
  }

  updateSearch() {
    this.searchParameters.updateInstitutions(this.selectedInstitutions.mapBy('name'));
    this.searchResults.updateResults();
  }
}
