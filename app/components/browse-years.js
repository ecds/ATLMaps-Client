import Ember from 'ember';
/* globals noUiSlider */

export default Ember.Component.extend({

    browseParams: Ember.inject.service('browse-params'),

    didInsertElement(){

        let model = this.get('model');
        let min = model.get('min_year');
        let max = model.get('max_year');

        let rangeSlider = document.getElementById('range');

        // Initializing the slider
        noUiSlider.create(rangeSlider, {
            start: [ min, max ],
            connect: true,
            range: {
                'min': min,
                'max': max
            }
        });

        var _this = this;

        rangeSlider.noUiSlider.on('update', function( values, handle ) {
            var value = values[handle];
            if ( handle ) {
                model.set('max_year', Math.round(value));
            } else {
                model.set('min_year', Math.round(value));
            }
        });

        rangeSlider.noUiSlider.on('set', function(){
            _this.get('browseParams').setYearSearch(min, max);
            _this.sendAction('getResults');
        });

        // Make reference so we can destory it when we remove the element.
        Ember.set(this, 'rangeSlider', rangeSlider);
    },

    willDestroyElement(){
        this.get('rangeSlider').noUiSlider.destroy();
    }

});
