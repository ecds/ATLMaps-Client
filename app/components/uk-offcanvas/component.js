import Component from '@glimmer/component';
import { action } from '@ember/object';
import UIkit from "uikit";

export default class UkOffcanvasComponent extends Component {
  offcanvas = null;
  
  @action
  initOffcanvas(element) {
    this.offcanvas = UIkit.offcanvas(element, { flip: true });
    if (this.args.open) {
      this.offcanvas.toggle();
    }
  }
  
  @action
  willDestroyNode() {
    this.offcanvas.toggle();
    this.offcanvas.$destroy(true);
  }
}
