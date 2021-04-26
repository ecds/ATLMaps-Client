import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'atlmaps-client/config/environment';

export default class ProjectRoute extends Route {
  @service deviceContext;
  @service fastboot;
  @service headData;
  @service router;

  init(...args) {
    super.init(...args);
    this.router.on('routeWillChange', () => {
      this.controllerFor('application').set('project', null);
      this.store.peekAll('rasterLayer').forEach(raster => {
        raster.setProperties({ onMap: false });
      });
      this.store.peekAll('vectorLayer').forEach(vector => {
        vector.setProperties({ onMap: false });
      });
    });
  }

  async model(params) {
    // For Fastboot, request the project without the associated layers.
    // Loading the layers requires Leaflet which is not available to Fastboot.
    if (this.fastboot.isFastBoot && params.project_id != 'explore') {
      return this.store.findRecord('project-meta', params.project_id);
    }
    // Search results are loaded through the SearchResultsService.
    if (params.project_id == 'explore') {
      return this.store.createRecord(
        'project',
        {
          name: 'Explore',
          mine: true,
          isExploring: true,
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
    const institutions = await this.store.query('institution', { limit: true });
    this.controllerFor('project').set('categories', categories);
    this.controllerFor('project').set('institutions', institutions);
    // When transitioning from an explore project to a saved project, we need to
    // ensure `isExploring` is set to `false`.
    if (model.id && model.isExploring) {
      model.setProperties({ isExploring: false });
    }
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
