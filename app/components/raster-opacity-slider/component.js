import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class RasterOpacitySliderComponent extends Component {
  @action
  preventDefault(event) {
    event.stopPropagation();
    event.preventDefault();
  }
}
