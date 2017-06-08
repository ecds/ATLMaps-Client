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
        // console.log('title', get(this, 'currentUser.user'));
    },

    model() {
        /**
         * The API will only return featured projects when asked for all.
         * We'll make seperate calls for a user's projects if a user is authenticated.
         */
        return RSVP.hash({
            mine: get(this, 'session.isAuthenticated') ? this.store.query('project', { user_id: true }) : undefined,
            featured: this.store.findAll('project'),
            currentUser: this.store.peekRecord('user', get(this, 'currentUser.user.id'))
        });
    },

    actions: {

        didTransition() {
            $(document).attr('title', 'ATLMaps: Projects');
        },

        willTransition() {
            this.store.unloadAll('project');
        },

        createProject() {
            // Create a new project with some basic data set.
            const project = this.store.createRecord('project', {
                name: 'Click Here to Update Title',
                description: 'Click here to add a description.',
                // I really hate this and there has to be a better way.
                published: false,
                center_lat: 33.75440100,
                center_lng: -84.3898100,
                zoom_level: 13,
                default_base_map: 'street',
                suppressIntro: true,
                showingSearch: true
            });

            const self = this;

            project.save().then((newProject) => {
                self.transitionTo('project.info', get(newProject, 'id'));
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
