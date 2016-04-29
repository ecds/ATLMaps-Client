import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('projects', function() {
        // TODO resource has been deprecated. make this a route.
        this.resource('project', { path: '/:project_id' }, function(){
            this.route('view');
            this.route('edit');
            this.route('info');
            this.route('vector-layers');
            this.route('raster-layers');
            this.route('base-layers');
            this.route('help');
            this.route('browse-layers');
        });
    });
  this.route('about');
  this.route('login');
  this.route('explore');
  this.route('terms');
  this.route('support', {path: '/help'});

  this.route('404', { path: '/*wildcard' });
  this.route('tagem');
});

export default Router;
