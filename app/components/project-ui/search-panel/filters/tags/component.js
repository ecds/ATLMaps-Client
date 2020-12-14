import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import UIkit from 'uikit';

export default class MapUiSearchPanelFiltersTagsComponent extends Component {
  @service searchParameters;
  @service searchResults;


  @action
  toggleTag(tag) {
    tag.setProperties({ checked: !tag.checked });
    this.searchParameters.updateTags(tag);
    this.searchResults.updateResults();
  }

  @action
  toggleCategory(category) {
    if (category.allChecked) {
      category.tags.forEach(tag => {
        tag.setProperties({
          checked: false
        });
        this.searchParameters.updateTags(tag);
      });
    } else {
      UIkit.accordion(document.getElementById('atlm-tag-accordion')).toggle(this.args.categories.indexOf(category), true);
      category.tags.forEach(tag => {
        tag.setProperties({
          checked: true
        });
        this.searchParameters.updateTags(tag);
      });
    }
    this.searchResults.updateResults();
  }
}
