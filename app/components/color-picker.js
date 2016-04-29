import Ember from 'ember';

export default Ember.Component.extend({

    dataColors: Ember.inject.service('data-colors'),

    classNames: ['color-picker', 'row'],
    //
    // shapeColors: function(){
        // return this.get('dataColors.shapeColors');
        // return '';
    // },
    //
    // shapeColors: '',
    willInsertElement(){
        console.log(this.get('shapeColors'));
        // this.setProperties('shapeColors', this.get('dataColors.shapeColors'));

    },

    actions: {
        setColor(color){
            let shapeColors = this.get('shapeColors');
            console.log(shapeColors.indexOf(color));
            console.log(color);
        }
    }

});
