/**
 * @public
 * Route to display layers outside of a project.
 * NOTE: Hopefully we can get rid of these try/catch handlers when we move to
 * JSONAPI. Somthing changed and Ember Data is not liking empty responses when
 * quering the store.
 */
import Ember from 'ember';
import MapLayerMixin from '../mixins/map-layer';

const { Route } = Ember;

export default Route.extend(MapLayerMixin, {});
