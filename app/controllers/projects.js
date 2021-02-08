import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ENV from 'atlmaps-client/config/environment';

export default class ProjectsController extends Controller {
  @service currentUser;

  @action
  deleteProject(project) {
    project.destroyRecord();
  }

  @action
  imageError(event) {
    event.target.setAttribute('src', ENV.APP.DEFAULT_IMAGE);
  }
}
