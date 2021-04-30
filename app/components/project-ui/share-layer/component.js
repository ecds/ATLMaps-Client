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

  @computed('base', 'color')
  get embedCode() {
    if (this.color) return `<iframe height=600 width=800 src="${this.args.layer.get('embedUrl')}?base=${this.base}&color=${this.encodeColor()}" />`;

    return `<iframe height=600 width=800 src="${this.args.layer.get('embedUrl')}?base=${this.base}" />`;
  }

  bases = A([
    'street',
    'grayscale',
    'satellite'
  ])

  encodeColor() {
    return this.color.replace('#', '%23');
  }

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
