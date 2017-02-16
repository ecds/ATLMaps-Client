import Ember from 'ember';

/**
 * Class to serve as a standin for a legacey cofiguration that nested
 * the projects route under the `projects` route. Doing so told EmberData
 * to laod all Projects just to show the one. Thus even if someone went
 * directly to `/projects/164` all the projects would be loaded. because
 * project links are floating around on grant applicaions and in articles,
 * this serves as a a redirect.
 *
 * NOTE: All projects still get loaded with this route. I tried to highjack
 * it with the `beforeModel` hook, but getting the `project_id` parameter
 * was oddly complex.
 *
 * TODO Can Ember give a 302 response on a redirect? I hope we can ditch
 * this in the future.
 */
const { Route } = Ember;

export default Route.extend({
    /**
     * Use the `redirect` hook (http://emberjs.com/api/classes/Ember.Route.html#method_redirect)
     * to send it to the correct route.
     */
    redirect(model) {
        this.transitionTo('project', model.id);
    }
});
