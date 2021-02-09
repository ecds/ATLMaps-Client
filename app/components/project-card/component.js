import Component from '@glimmer/component';
import { action } from '@ember/object';
import ENV from 'atlmaps-client/config/environment';

export default class ProjectCardComponent extends Component {
  @action
  imageError(event) {
    event.target.setAttribute('src', ENV.APP.DEFAULT_IMAGE);
  }
}
