import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('edit-project-modal');
  this.resource('projects', function() {
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

});

export default Router;
