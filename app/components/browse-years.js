/**
 * @private
 * Component to set a range of years to search.
 */
import Ember from 'ember';
/* globals noUiSlider */

const { Component, inject: { service }, set, get } = Ember;

export default Component.extend({

    browseParams: service(),

    didInsertElement() {
        const self = this;
        const model = this.get('model');
        const min = model.get('min_year');
        const max = model.get('max_year');
        const rangeSlider = document.getElementById('range');

        // Initializing the slider
        noUiSlider.create(rangeSlider, {
            start: [min, max],
            connect: true,
            // ES6: Enhanced object literal.
            range: { min, max }
        });

        rangeSlider.noUiSlider.on('update', (values, handle) => {
            const value = values[handle];
            if (handle) {
                model.set('max_year', Math.round(value));
            } else {
                model.set('min_year', Math.round(value));
            }
        });

        rangeSlider.noUiSlider.on('set', () => {
            self.get('browseParams').setYearSearch(model.get('min_year'), model.get('max_year'));
            self.sendAction('getResults');
        });

        // Make reference so we can destory it when we remove the element.
        // rangeSlider.noUiSlider.set([model.get('min_year'), model.get('max_year')]);
        set(this, 'rangeSlider', rangeSlider);
    },

    willDestroyElement() {
        get(this, 'rangeSlider').noUiSlider.destroy();
    }

});
