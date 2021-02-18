import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import UIKit from 'uikit';

export default class ProjectUiShareLayerComponent extends Component {
  @service notification;
  @service fastboot;

  @tracked
  base = this.bases.firstObject;

  @tracked
  color = '#1e88e5';

  shareModal = this.shareModal || null;
  embedModal = this.shareModal || null;

  @computed
  get shareUrl() {
    return `${window.location.origin}/layers/${this.args.layer.get('name')}`;
  }

  @computed('base', 'color')
  get embedUrl() {
    if (this.color) return `<iframe height=600 width=800 src=${window.location.origin}/embed/${this.args.layer.get('name')}?base=${this.base}&color=${this.color} />`;

    return `<iframe height=600 width=800 src=${window.location.origin}/embed/${this.args.layer.get('name')}?base=${this.base} />`;
  }

  bases = A([
    'street',
    'grayscale',
    'satellite'
  ])

  @action
  copyText(input) {
    if (this.fastboot.isFastBoot) return;
    document.getElementById(`${input}-${this.args.layer.get('name')}`).select();
    document.execCommand('copy');
    this.notification.setNote.perform({note: 'link copied'});
    this.shareModal.hide();
    this.embedModal.hide();
  }

  @action
  setBase(event) {
    this.base = event.srcElement.selectedOptions[0].value;
  }

  @action
  initShareModal(element) {
    this.shareModal = UIKit.modal(element);
  }

  @action
  initEmbedModal(element) {
    this.embedModal = UIKit.modal(element);
  }

}
