import Component from '@glimmer/component';
import { action } from '@ember/object';
// import { tracked } from '@glimmer/tracking';
import Draggabilly from 'draggabilly';

export default class ProjectUiPopupComponent extends Component {

  popupWindow = null;

  // @action
  // close() {
  //   this.args.activeFeature = null;
  // }

  @action
  initDraggable(element) {
    this.popupWindow = new Draggabilly(element, {
      handle: '.atlm-popup-handle'
    });
    window.addEventListener('keyup', event => {
      if (event && event.key == 'Escape') {
        this.args.close();
      }
    });
  }
}
