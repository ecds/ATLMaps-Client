import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import UIkit from "uikit";

export default class MapUiMenuComponent extends Component {
  @service fastboot;
  @service deviceContext;

  @tracked
  ukAccordion = null;

  @tracked
  ukAccordionOpen = false;

  @tracked
  panelTitle = '';

  @tracked
  showToggle = false;

  @tracked
  hideMenuPanel = true;

  checkIfOpen(accordion) {
    // I think this fires for the UIkit Accordion and for the
    // UIkit Tabs under it. Therefore, we can not rely on the
    // UIKit::Accordion to report its true state.
    this.ukAccordionOpen = accordion.firstElementChild.classList.contains('uk-open');
  }

  @action
  initUkAccordion(element) {

    if (this.fastboot.isFastBoot) return;
    const accordionOptions = {
      toggle: "> div > .uk-accordion-title"
    };
    this.ukAccordion = UIkit.accordion(element, accordionOptions);

    UIkit.util.on(this.ukAccordion.$el, 'show', event => {
      if (event.target.attributes['data-type'] && event.target.attributes['data-type'].value == 'panel') {
        this.panelTitle = event.target.attributes['data-panel-title'].value;
        this.showToggle = true;
      } else {
        this.panelTitle = '';
        this.showToggle = false;
      }
      this.checkIfOpen(element);
    });

    UIkit.util.on(this.ukAccordion.$el, 'hide', () => {
      this.checkIfOpen(element);
    });

    element.classList.remove('uk-hidden');
  }

  @action
  initUkTabs(element) {
    if (this.fastboot.isFastBoot) return;
    const tabOptions = {
      connect: "#component-tab-left",
      animation: "uk-animation-fade uk-animation-fast"
    };

    this.ukTabs = UIkit.tab(element, tabOptions);
  }
}
