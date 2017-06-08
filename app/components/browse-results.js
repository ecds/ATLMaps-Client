/**
 * TODO This is no longer needed?
 * Component to initiate UI for search results.
 */
import Ember from 'ember';

const { $, Component, inject: { service } } = Ember;

export default Component.extend({
    browseParams: service(),

    didRender() {
        $('ul.tabs').tabs();
    }
});
