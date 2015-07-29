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
            this.route('explore', {path: '/explore'});
        });
    });
  this.route('about');
  this.route('login');

});

export default Router;
