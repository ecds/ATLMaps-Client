import Ember from 'ember';

const {
    computed,
    Controller,
    get,
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

    // TODO: I don't like this.
    // computed property - whether this current route is a project.* page
    isProjectDetail: computed('currentRouteName', function() {
        if (get(this, 'currentRouteName').includes('project.') || get(this, 'currentRouteName').includes('tagem')) {
            return true;
        } else {
            return false;
        }
    })

});
