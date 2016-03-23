import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('edit-project-modal');
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
});

export default Router;

// installing route
//   create app/routes/projects/project.js
//   create app/templates/projects/project.hbs
// updating router
//   add route projects/project
// installing route-test
//   create tests/unit/routes/projects/project-test.js
