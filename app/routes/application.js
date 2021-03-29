import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'atlmaps-client/config/environment';

export default class ApplicationRoute extends Route {
  @service currentUser;
  @service session;
  @service fastboot;
  @service headData;
  @service metrics;
  @service router;

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
          content: '/assets/images/logo-med.jpg'
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
          content: 'ATLMaps'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-image',
        attrs: {
          property: 'twitter:image',
          content: '/assets/images/logo-med.jpg'
        }
      }
    ];
  }

}
