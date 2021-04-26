import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import UIKit from "uikit";

export default class ProjectUiMenuComponent extends Component {
  @service deviceContext;
  @service fastboot;
  @service session;

  @tracked
  ukAccordion = null;

  @tracked
  ukAccordionOpen = true;

  @tracked
  panelTitle = '';

  @tracked
  showToggle = false;

  @tracked
  hideMenuPanel = false;

  checkIfOpen(accordion) {
    // I think this fires for the UIKit Accordion and for the
    // UIKit Tabs under it. Therefore, we can not rely on the
    // UIKit::Accordion to report its true state.
    this.ukAccordionOpen = accordion.firstElementChild.classList.contains('uk-open');
  }

  @action
  initUkAccordion(element) {

    const accordionOptions = {
      toggle: "> div > .uk-accordion-title"
    };
    this.ukAccordion = UIKit.accordion(element, accordionOptions);

    UIKit.util.on(this.ukAccordion.$el, 'show', event => {
      if (event.target.attributes['data-type'] && event.target.attributes['data-type'].value == 'panel') {
        this.panelTitle = event.target.attributes['data-panel-title'].value;
        this.showToggle = true;
      } else {
        this.panelTitle = '';
        this.showToggle = false;
      }
      this.checkIfOpen(element);
    });

    UIKit.util.on(this.ukAccordion.$el, 'hide', () => {
      this.checkIfOpen(element);
    });

    element.classList.remove('uk-hidden');
  }

  @action
  initUkTabs(element) {
    const tabOptions = {
      connect: "#component-tab-left",
      animation: "uk-animation-fade uk-animation-fast"
    };

    this.ukTabs = UIKit.tab(element, tabOptions);
    if (this.args.project.isNew || this.args.project.name == 'untitled') {
      this.ukTabs.show(-1);
    }
  }

  @action
  initMobilePanel(element) {
    this.mobilePanel = UIKit.switcher(element);
  }

  @action
  closeMobilePanel() {
    this.hideMenuPanel = true;
  }
}
