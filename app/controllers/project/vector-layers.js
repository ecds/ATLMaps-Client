import Ember from 'ember';

export default Ember.Controller.extend({

    projectController: Ember.inject.controller('project'),

    isEditing: Ember.computed.reads('projectController.isEditing'),

    dataColors: Ember.inject.service('data-colors'),

    shapeColors: function(){
        let shapeColors = this.get('dataColors.shapeColors');
        let colors = [];
        for(let hex in shapeColors) {
            colors.push(shapeColors[hex]);
        }
        return colors;
    }.property(),

    // actions: {
    //     updateColor(newColor, layer){
    //         layer.setProperties('marker', newColor);
    //     }
    // }

});
