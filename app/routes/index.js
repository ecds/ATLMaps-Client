import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service fastboot;
  @service headData;

  async model() {
    return this.store.findAll('project');
  }

  headTags = [
      {
        type: 'meta',
        tagId: 'meta-og-name',
        attrs: {
          property: 'og:name',
          content: 'project.name'
        }
      }
    ];
}
