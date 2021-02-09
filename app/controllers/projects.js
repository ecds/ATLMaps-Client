import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ProjectsController extends Controller {
  @service currentUser;

  @action
  deleteProject(project) {
    project.destroyRecord();
  }
}
