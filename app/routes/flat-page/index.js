import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
    model() {
        return this.store.findAll('project');
    },

    actions: {
        willTransition() {
            this._super(...arguments);
            this.store.unloadAll('project');
        },

        clickUserMenu() {
            document.getElementById('user-menu-link').click();
        }
    }
});
