import Ember from 'ember';
/* globals noUiSlider */

export default Ember.Component.extend({

    browseParams: Ember.inject.service('browse-params'),

    // didRender(){
    //     this.get('rangeSlider').noUiSlider.set([this.get('model').get('min_year'), this.get('model').get('max_year')]);
    // },

    didInsertElement(){

        let model = this.get('model');
        let min = model.get('min_year');
        let max = model.get('max_year');

        console.log(min);

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
            _this.get('browseParams').setYearSearch(model.get('min_year'), model.get('max_year'));
            _this.sendAction('getResults');
        });

        // Make reference so we can destory it when we remove the element.
        // rangeSlider.noUiSlider.set([model.get('min_year'), model.get('max_year')]);
        Ember.set(this, 'rangeSlider', rangeSlider);
    },

    willDestroyElement(){
        this.get('rangeSlider').noUiSlider.destroy();
    }

});
