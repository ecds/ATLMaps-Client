import Ember from 'ember';

const {
    $,
    on,
    Component,
    inject: { service },
    get,
    getOwner,
    set
} = Ember;

export default Component.extend({
    activateKeyboard: on('init', () => {
        set(this, 'keyboardActivated', true);
    }),

    cookies: service(),
    tagName: '',
    // classNames: ['intro-modal-link-foo'],
    // classNameBindings: ['withMedia:with-media'],
    //
    withMedia: false,

    keyboardActivated: true,

    editing: false,

    didRender() {
        const currentRoute = getOwner(this).lookup('controller:application').currentPath;
        if ((currentRoute.indexOf('settings') !== -1) && get(this, 'model.project.may_edit')) {
            set(this, 'editing', true);
        }
        if (get(this, 'model.project.media') || get(this, 'model.project.photo')) {
            set(this, 'withMedia', true);
        }
        $('#edit-project-intro').trumbowyg({
            fullscreenable: false,
            removeformatPasted: true,
            resetCss: true,
            btns: [
                ['viewHTML'],
                ['undo', 'redo'],
                'btnGrp-semantic',
                ['link'],
                ['insertImage'],
                'btnGrp-lists',
                ['fullscreen']
            ]
        }).on('tbwchange', () => {
            set(this, 'model.project.intro', $('#edit-project-intro').trumbowyg('html'));
        });
    },

    willDestroyElement() {
        $('#edit-project-intro').trumbowyg('destroy');
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
                model.setProperties({ hasSuppressCookie: true });
            }
        }
    }
});
