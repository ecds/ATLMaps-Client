import Ember from 'ember';

// Service to hold arrays of colors to be used for vector layers.
// In `vector_layer_project` the `marker` attribute is used as an
// index of the arrays.

// Made a second one for shapes and lines. The lighter colors looked like crap.

export default Ember.Service.extend({
    init(){
        this._super(...arguments);

        this.set('markerColors',
           {
               'amber-300': '#FFD54F',
                'amber-400': '#FFCA28',
                'amber-500': '#FFC107',
                'amber-600': '#FFC107',
                'blue-500': '#2196F3',
                'blue-600': '#1E88E5',
                'blue-700': '#1976D2',
                'blue-800': '#1565C0',
                'blue-900': '#0D47A1',
                'cyan-200': '#80DEEA',
                'cyan-300': '#4DD0E1',
                'cyan-400': '#26C6DA',
                'cyan-500': '#00BCD4',
                'cyan-600': '#00ACC1',
                'cyan-700': '#0097A7',
                'cyan-800': '#00838F',
                'cyan-900': '#006064',
                'deep-orange-300': '#FF8A65',
                'deep-orange-400': '#FF7043',
                'deep-orange-500': '#FF5722',
                'deep-orange-600': '#F4511E',
                'deep-orange-700': '#E64A19',
                'deep-purple-300': '#9575CD',
                'deep-purple-400': '#7E57C2',
                'deep-purple-500': '#673AB7',
                'deep-purple-600': '#5E35B1',
                'green-300': '#81C784',
                'green-400': '#66BB6A',
                'green-500': '#4CAF50',
                'green-600': '#43A047',
                'indigo-400': '#5C6BC0',
                'indigo-500': '#3F51B5',
                'indigo-600': '#3949AB',
                'indigo-700': '#303F9F',
                'orange-300': '#FFB74D',
                'orange-400': '#FFA726',
                'orange-500': '#FF9800',
                'orange-600': '#FB8C00',
                'orange-700': '#F57C00',
                'pink-400': '#EC407A',
                'pink-500': '#E91E63',
                'pink-600': '#D81B60',
                'pink-700': '#C2185B',
                'purple-300': '#BA68C8',
                'purple-400': '#AB47BC',
                'purple-500': '#9C27B0',
                'purple-600': '#8E24AA',
                'purple-700': '#7B1FA2',
                'red-300': '#E57373',
                'red-400': '#EF5350',
                'red-500': '#F44336',
                'red-600': '#E53935',
                'red-700': '#D32F2F',
                'yellow-400': '#FFEE58',
                'yellow-500': '#FFEB3B',
                'yellow-600': '#FDD835'
            }
        );

        this.set('shapeColors',
            {
                'blue-600': '#1E88E5',
                'blue-700': '#1976D2',
                'blue-800': '#1565C0',
                'cyan-600': '#00ACC1',
                'cyan-700': '#0097A7',
                'cyan-800': '#00838F',
                'deep-orange-600': '#F4511E',
                'deep-orange-700': '#E64A19',
                'deep-purple-500': '#673AB7',
                'deep-purple-600': '#5E35B1',
                'light-green-600': '#7CB342',
                'light-green-700': '#689F38',
                'orange-600': '#FB8C00',
                'orange-700': '#F57C00',
                'orange-800': '#EF6C00',
                'pink-600': '#D81B60',
                'pink-700': '#C2185B',
                'red-600': '#D81B60',
                'red-700': '#C2185B',
                'teal-600': '#00897B',
                'teal-700': '#00796B'
            }
        );

    }
});
