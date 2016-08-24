import Ember from 'ember';

const {
    computed,
    Controller,
    inject: {
        service
    }
} = Ember;

export default Controller.extend({
    session: service(),

    actions: {
        invalidateSession() {
            this.get('session').invalidate();
        }
    },

    // computed property - whether this current route is a project.* page
    isProjectDetail: computed('currentRouteName', function() {
        return (this.get('currentRouteName').includes('project.'));
    })

});
