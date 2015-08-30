import Ember from 'ember';
import DS from 'ember-data';

/* globals md5 */

export default Ember.Route.extend({
	actions : {

        didTransition: function() {
            Ember.$(document).attr('title', 'ATLMaps: Projects');
        },
        
        createProject: function() {
            
            var newProjectName = md5((new Date()).toTimeString());
            
            var project = this.store.createRecord('project', {
                name: newProjectName,
                user_id: this.session.get('content.secure.user.id'),
                published: false,
                center_lat: 33.75440100,
                center_lng: -84.3898100,
                zoom_level: 13
            });
            
            var _this = this;
            
            var onSuccess = function() {
                
                var newProject = DS.PromiseObject.create({
                    promise: _this.store.query('project', { name: newProjectName })
                });
    
                newProject.then(function() {
                	newProject.get('firstObject').set('name', 'Please enter a title.');
                    _this.transitionTo('project.edit', newProject.get('firstObject').id);
                });
            };
            //this.store.pushObject('project', project);
            project.save().then(onSuccess);

        },
    }
});
