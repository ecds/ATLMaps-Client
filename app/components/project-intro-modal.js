import Ember from 'ember';

const {
    $,
    Component,
    inject: { service },
    get,
    getOwner,
    set
} = Ember;

export default Component.extend({
    cookies: service(),

    classNames: ['intro-modal-link'],

    keyboardActivated: true,

    editing: false,

    didRender() {
        const currentRoute = getOwner(this).lookup('controller:application').currentPath;
        if ((currentRoute.indexOf('settings') !== -1) && get(this, 'model.project.may_edit')) {
            set(this, 'editing', true);
            $('#edit-project-intro').trumbowyg({
                fullscreenable: false,
                removeformatPasted: true
            });
        }
    },

    actions: {

        suppressIntro() {
            const model = get(this, 'model.project');
            const cookieService = get(this, 'cookies');
            const cookieName = `noIntro${model.id}`;

            if (get(model, 'hasSuppressCookie')) {
                cookieService.clear(cookieName);
                model.setProperties({ hasSuppressCookie: false });
            } else {
                cookieService.write(cookieName, `Surppress-intro-for-project-${model.id}-on-ATLMaps.`);
                model.setProperties({ hasSuppressCookie: true, suppressIntro: true });
            }
        }
    }
});
