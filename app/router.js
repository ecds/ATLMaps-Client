import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('edit-project-modal');
  this.resource('projects', function() {
        this.resource('project', { path: '/:project_id' });
    });
  this.route('about');
  this.route('project-layer');
});
