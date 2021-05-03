import Component from '@glimmer/component';
import { action } from '@ember/object';
import ENV from 'atlmaps-client/config/environment';

export default class ProjectCardComponent extends Component {
  publishTip = 'Publishing a project will allow you anyone to view your project. It not be listed on the site. You will have to share the link for others to find it.';
  unPublishTip = 'If you un-publish your project, you will be the only person able to view it.';
  @action
  imageError(event) {
    event.target.setAttribute('src', ENV.APP.DEFAULT_IMAGE);
  }
}
