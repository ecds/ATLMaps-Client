import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Draggabilly from 'draggabilly';

export default class ProjectUiPopupComponent extends Component {

  @service deviceContext;

  popupWindow = null;

  @action
  initDraggable(element) {
    if (this.deviceContext.isMobile) return;
    this.popupWindow = new Draggabilly(element, {
      handle: '.atlm-popup-handle'
    });
    window.addEventListener('keyup', event => {
      if (event && event.key == 'Escape') {
        this.args.close();
      }
    });
  }

  @action
  clearActiveFeatureKey(event) {
    // if (!event || event.type != 'keyup') return;
    if (event && event.type == 'keyup' && event.key == 'Escape' || event.key == 'Enter' && event.target.id == 'atlm-close-popup-button') {
      this.clearActiveFeature();
    }
  }

  @action
  clearActiveFeature() {
    if (this.activeVectorTile) {
      this.deactivateVT();
    }

    if (this.activeFeature) {
      this.activeFeature.setProperties({
        active: false
      });
    }
    this.args.clearActiveFeature();
  }
}
