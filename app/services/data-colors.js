import Ember from 'ember';

// Service to hold arrays of colors to be used for vector layers.
// In `vector_layer_project` the `marker` attribute is used as an
// index of the arrays.

// Made a second one for shapes and lines. The lighter colors looked like crap.

export default Ember.Service.extend({
    init(){
        this._super(...arguments);

        this.set('markerColors',
           [
               "amber-300",
                "amber-400",
                "amber-500",
                "amber-600",
                "blue-500",
                "blue-600",
                "blue-700",
                "blue-800",
                "blue-900",
                "cyan-200",
                "cyan-300",
                "cyan-400",
                "cyan-500",
                "cyan-600",
                "cyan-700",
                "cyan-800",
                "cyan-900",
                "deep-orange-300",
                "deep-orange-400",
                "deep-orange-500",
                "deep-orange-600",
                "deep-orange-700",
                "deep-purple-300",
                "deep-purple-400",
                "deep-purple-500",
                "deep-purple-600",
                "green-300",
                "green-400",
                "green-500",
                "green-600",
                "indigo-400",
                "indigo-500",
                "indigo-600",
                "indigo-700",
                "orange-300",
                "orange-400",
                "orange-500",
                "orange-600",
                "orange-700",
                "pink-400",
                "pink-500",
                "pink-600",
                "pink-700",
                "purple-300",
                "purple-400",
                "purple-500",
                "purple-600",
                "purple-700",
                "red-300",
                "red-400",
                "red-500",
                "red-600",
                "red-700",
                "yellow-400",
                "yellow-500",
                "yellow-600"
            ]
        );

        this.set('shapeColors',
            {
                "blue-600": '#1E88E5',
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
