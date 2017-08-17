import Ember from 'ember';
import config from './config/environment';

/**
 * This is a router.
 */

const Router = Ember.Router.extend({
  location: config.locationType,
  metrics: Ember.inject.service(),
  session: Ember.inject.service(),
  currentUser: Ember.inject.service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();

    if (!this.get('currentUser.displayname')) {
        this.get('currentUser').load();
    }
  },

  _trackPage() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      const page = document.location.pathname;
      const title = this.getWithDefault('currentRouteName', 'unknown');

      Ember.get(this, 'metrics').trackPage({
        page,
        title
      });
    });
  }
});

Router.map(function() {
  this.route('flat-page', {
    path: '/'
  }, function() {
    this.route('index', {
      path: '/'
    });
    this.route('about');
    this.route('projects');
    this.route('404', {
      path: '/*wildcard'
    });
  });

  this.route('project', {
    path: '/project/:project_id'
  }, function() {
    this.route('info');
    this.route('vector-layers');
    this.route('raster-layers');
    this.route('settings');
  });

  // });
  this.route('explore');
  this.route('layers', {
    path: '/layers/:maps'
  });
  this.route('error');
  this.route('confirm', {
    path: '/confirm/:confirm_token'
  });
  this.route('embed', {
    path: '/embed/:maps'
  });

  this.route('admin', function() {
    this.route('data', function() {
      this.route('new');
      this.route('edit', {
          path: 'edit/:layer_id'
      });
    });
  });
});

export default Router;
