import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MapUiShareLayerComponent extends Component {
  @service notification;
  @service dataColors;

  @tracked
  base = this.bases.firstObject;

  @tracked
  color = null;

  @computed
  get shareUrl() {
    return `${window.location.origin}/layers/${this.args.layer.get('name')}`;
  }

  @computed('base', 'color')
  get embedUrl() {
    if (this.color) return `<iframe height=600 width=800 src=${window.location.origin}/embed/${this.args.layer.get('name')}?base=${this.base}&color=${this.color.name} />`;

    return `<iframe height=600 width=800 src=${window.location.origin}/embed/${this.args.layer.get('name')}?base=${this.base} />`;
  }

  bases = A([
    'street',
    'grayscale',
    'satellite'
  ])

  @action
  copyText(input) {
    document.getElementById(`${input}-${this.args.layer.get('name')}`).select();
    document.execCommand('copy');
    this.notification.setNote.perform({note: 'link copied'});
  }

  @action
  setBase(event) {
    this.base = event.srcElement.selectedOptions[0].value;
  }

  @action
  setColor(color) {
    this.color = color;
  }
}
