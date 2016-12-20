import Ember from 'ember';
import config from './config/environment';

/**
 * This is a motherfucking router.
 */

var Router = Ember.Router.extend({
    location: config.locationType,
    metrics: Ember.inject.service(),

    didTransition() {
        this._super(...arguments);
        this._trackPage();
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
    this.route('projects', function() {
      this.route('show', { path: '/:project_id' });
    });//, function() {
        // TODO resource has been deprecated. make this a route.
        // Project needs to come out from under projects but we
        // will need to figure out redirects for the bad urls.
        this.route('project', {
            path: '/project/:project_id'
        }, function() {
          this.route('edit');
          this.route('info');
          this.route('vector-layers');
          this.route('raster-layers');
          this.route('base-layers');
          this.route('help');
          this.route('browse-layers');
        });
    // });
    this.route('about');
    this.route('login');
    this.route('explore');
    this.route('terms');
    this.route('support', {
        path: '/help'
    });
    // this.route('tagem');
    this.route('404', {
        path: '/*wildcard'
    });
});

export default Router;
