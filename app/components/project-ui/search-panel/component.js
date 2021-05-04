import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { keyResponder, onKey } from 'ember-keyboard';
import { action } from '@ember/object';
import UIKit from 'uikit';

@keyResponder
export default class ProjectUiSearchPanelComponent extends Component {
  @service searchResults;

  switcher = null;

  constructor() {
    super(...arguments);
    UIKit.util.on(`#${this.args.ukOffcanvasId}`, 'shown', function() {
      document.getElementById('atlm-layer-text-search').focus();
    });
  }

  @action
  initSwitcher(element) {
    this.switcher = UIKit.switcher(element);
  }

  @onKey('alt+f')
  filters() {
    this.switcher.show(0);
  }

  @onKey('alt+m')
  mapResults() {
    this.switcher.show(1);
  }

  @onKey('alt+p')
  placeResults() {
    this.switcher.show(2);
  }

  @onKey('alt+d')
  dataResults() {
    this.switcher.show(3);
  }
}
