/**
 * Route to display list of projects
 */
import Ember from 'ember';

/* globals md5 */

const {
    $,
    get,
    Route,
    RSVP,
    inject: {
        service
    }
} = Ember;

export default Route.extend({
    session: service(),
    currentUser: service(),

    _loadCurrentUser() {
        return this.get('currentUser').load();
    },

    beforeModel() {
        return this._loadCurrentUser();
    },

    model() {
        /**
         * The API will only return featured projects when asked for all.
         * We'll make seperate calls for a user's projects if a user is authenticated.
         */
        if (this.get('session.isAuthenticated')) {
            return RSVP.hash({
                mine: this.store.query('project', {
                    user_id: true
                }),
                // collaborations: this.store.query('project', {
                //     collaborations: get(this, 'currentUser.user.id')
                // }),
                featured: this.store.query('project', { user_id: true })
            });
        }
        console.log('this', this);
        return RSVP.hash({
            featured: this.store.findAll('project')
        });
    },

    // _loadCurrentUser() {
    //     return this.get('currentUser').load();
    // },

    actions: {

        didTransition() {
            $(document).attr('title', 'ATLMaps: Projects');
        },

        createProject() {
            // Placehoder name for project.
            const newProjectName = md5((new Date()).toTimeString());

            // Create a new project with some basic data set.
            const project = this.store.createRecord('project', {
                name: newProjectName,
                // I really hate this and there has to be a better way.
                user_id: get(this, 'currentUser.user.id'),
                published: false,
                center_lat: 33.75440100,
                center_lng: -84.3898100,
                zoom_level: 13,
                default_base_map: 'street',
                editing: true
            });

            const self = this;

            project.save().then((newProject) => {
                newProject.setProperties(
                    {
                        name: 'Please enter a title.',
                        editing: true
                    }
                );

                self.transitionTo('project.info', newProject.get('id'));
                // Success callback
                // Get the newly created project
                // self.store.queryRecord('project', {
                //     name: newProjectName
                // }).then(function(newProject) {
                //     // Set the name so we don't just have some ugly string in there.
                //     newProject.set('name', 'Please enter a title.');
                //     // Transition to our new project
                //     self.transitionTo('project.info', newProject.id);
                // }, function(){
                //     // Error callback
                //     // TODO What should we do if this fails?
                // });
            });
        },

        deleteProject(project_id) {
            // eslint-disable-next-line no-alert
            const response = confirm(
                'Are you sure you want to DELETE this project?'
            );

            if (response === true) {
                this.store.peekRecord('project', project_id).destroyRecord();
            }
        }
    }
});
