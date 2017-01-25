import Ember from 'ember';

const {
    computed,
    Controller,
    get,
    inject: { service }
} = Ember;

export default Controller.extend({
    session: service(),

    // TODO: I don't like this.
    // computed property - whether this current route is a project.* page
    isProjectDetail: computed('currentRouteName', function() {
        if (get(this, 'currentRouteName').includes('project.') || get(this, 'currentRouteName').includes('layers')) {
            return true;
        }
        return false;
    })
});
