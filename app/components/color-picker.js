import Ember from 'ember';

export default Ember.Component.extend({

    dataColors: Ember.inject.service('data-colors'),

    classNames: ['color-picker', 'row'],

    willInsertElement(){
        console.log(this.get('shapeColors'));
    },

    actions: {
        setColor(color, layer){
            let shapeColors = this.get('shapeColors');
            let newColor = shapeColors.indexOf(color);
            layer.setProperties({marker: newColor});
            layer.save();
        }
    }

});
