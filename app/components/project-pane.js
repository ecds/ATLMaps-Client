import Ember from 'ember';

const { $, Component, inject: { service } } = Ember;

export default Component.extend({
    classNames: ['project-pane'],
    flashMessage: service(),
    session: service(),

    // TODO: This is bad. Make vector detail a proper component.
    click() {
        $('div.vector-info').hide();
        $('.active-marker').removeClass('active-marker');
    }
});
