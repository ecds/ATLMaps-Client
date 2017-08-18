import Ember from 'ember';

const { Component, set, $ } = Ember;

export default Component.extend({
    // onCh
    didRender() {
        this._super(...arguments);
        $('#vector-layer-description-edit').trumbowyg({
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
            set(this, 'model.description', $('#vector-layer-description-edit').trumbowyg('html'));
        });
    },

    willDestroyElement() {
        this._super(...arguments);
        $('#vector-layer-description-edit').trumbowyg('destroy');
    }
});
