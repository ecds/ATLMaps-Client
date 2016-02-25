import Ember from 'ember';

export default Ember.Controller.extend({
    needs: "project",

    isEditing: Ember.computed.alias("controllers.project.isEditing"),
    showBrowse: Ember.computed.alias("controllers.project.showBrowse"),

    yearRange: function(){
        var _this = this;
        var yearRange = DS.PromiseObject.create({
            promise: this.store.find('yearRange', 1)
        });

        yearRange.then(function(){
            var range = yearRange;
            var min = range.get('content.min_year');
            var max = range.get('content.max_year');

            // this.setProperties({startYear: min, endYear: max});
            var rangeSlider = document.getElementById('range');

            try {
              // Initializing the slider
              noUiSlider.create(rangeSlider, {
                start: [ min, max ],
                connect: true,
                range: {
                  'min': min,
                  'max': max
                }
              });

              // Linking the inputs
              var inputMinYear = document.getElementById('start_year');
              var inputMaxYear = document.getElementById('end_year');

              rangeSlider.noUiSlider.on('update', function( values, handle ) {
                var value = values[handle];
                if ( handle ) {
                  inputMaxYear.value = Math.round(value);
                } else {
                  inputMinYear.value = Math.round(value);
                }
              });

              inputMaxYear.addEventListener('change', function(){
                rangeSlider.noUiSlider.set([null, this.value]);
              });

              inputMinYear.addEventListener('change', function(){
                rangeSlider.noUiSlider.set([this.value, null]);
              });

              rangeSlider.noUiSlider.on('set', function(){
                _this.send('yearFilter');
              });

            }
            catch(err){
              // Don't care
            }
            return yearRange;
        });
    }.property(),

    actions: {}
});
