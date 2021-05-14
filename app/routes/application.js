import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import ENV from 'atlmaps-client/config/environment';

export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin) {
  @service currentUser;
  @service session;
  @service fastboot;
  @service headData;
  @service metrics;
  @service router;

  routeAfterAuthentication = null;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', () => {
      const page = this.router.currentURL;
      const title = this.headData.title;
      this.metrics.trackPage({ page, title });
    });
  }

  afterModel() {
    this.setHeadTags();
  }

  setHeadTags() {
    this.headTags = [
      {
        type: 'meta',
        tagId: 'meta-og-type',
        attrs: {
          property: 'og:type',
          content: 'website'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image',
        attrs: {
          property: 'og:image',
          content: `${ENV.APP.HOST}${ENV.APP.DEFAULT_IMAGE}`
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-url',
        attrs: {
          property: 'og:url',
          content: `${ENV.APP.HOST}`
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-title',
        attrs: {
          property: 'og:title',
          content: 'ATLMaps'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-description',
        attrs: {
          property: 'og:description',
          content: 'The ATLMaps platform, a collaboration between Georgia State University and Emory University, combines archival maps, geospatial data visualization, and user contributed multimedia location pinpoints to promote investigation into any number of issues about Atlanta.'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-card',
        attrs: {
          property: 'twitter:card',
          content: 'summary'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-title',
        attrs: {
          property: 'twitter:title',
          content: 'ATLMaps'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-description',
        attrs: {
          property: 'twitter:description',
          content: 'The ATLMaps platform, a collaboration between Georgia State University and Emory University, combines archival maps, geospatial data visualization, and user contributed multimedia location pinpoints to promote investigation into any number of issues about Atlanta.'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-image',
        attrs: {
          property: 'twitter:image',
          content: `${ENV.APP.HOST}${ENV.APP.DEFAULT_IMAGE}`
        }
      }
    ];
  }

}
