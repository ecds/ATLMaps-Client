/**
 * @public
 * Component's template will yeild content if there is an
 * authenticated session.
*/
import Ember from 'ember';

const { Component, inject: { service } } = Ember;

export default Component.extend({
    session: service(),
    currentUser: service()
});
