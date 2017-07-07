import Ember from 'ember';

const {
    Component,
    Object: EmberObject,
    computed,
    get
} = Ember;

export default Component.extend({
    routes: null,

    init() {
        this._super(...arguments);
        this.set('routes', [
            EmberObject.create({
                route: 'project.info',
                label: 'Info',
                icon: 'info_outline',
                iconClass: null,
                show: true
            }),
            EmberObject.create({
                route: 'project.raster-layers',
                label: 'Maps',
                icon: 'layers',
                iconClass: null,
                show: get(this, 'model.hasRasters')
            }),
            // Vector layers uses a custom icon.
            EmberObject.create({
                route: 'project.vector-layers',
                label: 'Data',
                icon: null,
                iconClass: 'atlmaps-ext database',
                show: get(this, 'model.hasVectors')
            }),
            EmberObject.create({
                route: 'project.base-layers',
                label: 'Base',
                icon: 'map',
                iconClass: null,
                show: true
            })
        ]);
    },

    classNames: ['project-nav', 'container', 'z-depth-3'],
    classNameBindings: ['hideNav'],
    tagName: 'ul',
    hideNav: false,

    links: computed.filterBy('routes', 'show', true),

    actions: {
        toggleNav() {
            this.toggleProperty('hideNav');
        }
    }
});
