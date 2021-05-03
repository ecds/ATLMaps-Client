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
  toggleFeatured(project) {
    project.setProperties(
      {
        featured: !project.featured
      }
    );
    if (project.featured) {
      project.setProperties({ published: true });
    }
    this.saveProject(project);
  }

  @action
  togglePublished(project) {
    project.setProperties({ published: !project.published });
    this.saveProject(project);
  }

  saveProject(project) {
    if (ENV.environment != 'test') {
      project.save();
    }
  }
}
