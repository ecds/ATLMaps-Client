// TODO GET RID OF THIS!!!!!!
import Ember from 'ember';

const {
    Controller,
    computed,
    inject: {
        controller,
        service
    }
} = Ember;

export default Controller.extend({

    projectController: controller('project'),

    isEditing: computed.reads('projectController.isEditing'),

    dataColors: service(),

    shapeColors: function() {
        let shapeColors = this.get('dataColors.shapeColors');
        let colors = [];
        for (let hex in shapeColors) {
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
