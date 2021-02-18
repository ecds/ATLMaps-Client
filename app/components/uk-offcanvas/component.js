import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import UIKit from "uikit";

export default class UkOffcanvasComponent extends Component {
  @tracked
  offcanvas = null;

  @action
  initOffcanvas(element) {
    this.offcanvas = UIKit.offcanvas(
      element,
      {
        flip: true,
        container: '#off-canvas-container'
      }
    );
    if (this.args.open) {
      this.offcanvas.toggle();
    }
  }

  @action
  initToggle(element) {
    this.offcanvas.$destroy();
    this.initOffcanvas(this.offcanvas.$el);
    UIKit.toggle(element, { target: this.offcanvas.$el });
  }

  @action
  willDestroyNode() {
    this.offcanvas.$destroy();
    // if (this.offcanvas.isToggled()) {
    //   console.log('closing canvas')
    // } else {
    //   console.log('not open?')
    // }
  }
}
