import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Layer from './layer';

export default Layer.extend({

    marker: attr(),
    vector_layer_project: belongsTo('vector_layer_project', {
        async: true,
        inverse: null
    }),
    color_name: attr('string'),
    color_hex: attr('string'),
    // opacity: attr('number', {
    //     defaultValue: 1
    // }),
    showing: attr('boolean', {
        defaultValue: true
    })

    // color_group: Ember.computed(function(){
    //     if(this.get('data_type') === 'point-data'){
    //         return 'markerColors';
    //     }
    //     else {
    //         return 'shapeColors';
    //     }
    // })
});
