import Component from '@glimmer/component';
import { action } from '@ember/object';
import UIKit from 'uikit';

export default class ProjectUiIntroModalEditComponent extends Component {
  modal = null;

  @action
  initModal(element) {
    this.modal = UIKit.modal(element);
  }

  @action
  saveProject() {
    this.args.project.save();
    this.modal.hide();
  }
}
