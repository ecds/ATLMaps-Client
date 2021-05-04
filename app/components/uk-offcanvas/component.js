import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { keyResponder, onKey } from 'ember-keyboard';
import UIKit from "uikit";

@keyResponder
export default class UkOffcanvasComponent extends Component {
  @tracked
  offcanvas = null;

  @action
  initOffcanvas(element) {
    this.offcanvas = UIKit.offcanvas(
      element,
      {
        flip: this.args.flip,
        container: '#off-canvas-container'
      }
    );
    if (this.args.open) {
      this.offcanvas.toggle();
    }
  }

  @action
  willDestroy() {
    this.offcanvas.hide();
    this.offcanvas.$destroy(true);
  }

  @onKey('alt+shift+KeyS')
  showOffcanvas() {
    this.offcanvas.show();
  }
}
