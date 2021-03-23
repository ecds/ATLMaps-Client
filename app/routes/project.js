import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'atlmaps-client/config/environment';

export default class ProjectRoute extends Route {
  @service deviceContext;
  @service fastboot;
  @service headData;

  init(...args) {
    super.init(...args);
    this.on('routeWillChange', () => {
      this.controllerFor('application').set('project', null);
    });
  }

  async model(params) {
    // Search results are loaded through the SearchResultsService.
    if (params.project_id == 'explore') {
      return this.store.createRecord(
        'project',
        {
          name: 'Explore',
          mine: true,
          isExploring: true,
          description: 'Here you can view and layer maps and data and share links to individual layers without an account. To save and share a collection of layers, you must sign in.'
        }
      );
    }
    return this.store.findRecord('project', params.project_id);
  }

  async afterModel(model) {
    this.deviceContext.setDeviceContext();
    this.controllerFor('application').set('project', model.name);
    this.setHeadTags(model);
    const categories = await this.store.findAll('category');
    this.controllerFor('project').set('categories', categories);
  }

  setHeadTags(model) {
    const title = `${model.name}: ATLMaps`;
    this.headData.title = title;
    this.set('headTags', [
      {
        type: 'meta',
        tagId: 'meta-og-title',
        attrs: {
          property: 'og:title',
          content: title
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image',
        attrs: {
          property: 'og:image',
          content: model.photo || '/assets/images/logo-med.jpg'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-url',
        attrs: {
          property: 'og:url',
          content: `${ENV.APP.HOST}/projects/${model.id}`
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-description',
        attrs: {
          property: 'og:description',
          content: model.description
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-title',
        attrs: {
          property: 'twitter:title',
          content: title
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-description',
        attrs: {
          property: 'twitter:description',
          content: model.description
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-image',
        attrs: {
          property: 'twitter:image',
          content: model.photo || '/assets/images/logo-med.jpg'
        }
      }
    ]);
  }
}
