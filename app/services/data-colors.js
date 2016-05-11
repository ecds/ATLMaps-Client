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
               { name: 'red-300', hex: '#E57373'},
               { name: 'red-400', hex: '#EF5350'},
               { name: 'red-500', hex: '#F44336'},
               { name: 'red-600', hex: '#E53935'},
               { name: 'red-700', hex: '#D32F2F'},
               { name: 'pink-400', hex: '#EC407A'},
               { name: 'pink-500', hex: '#E91E63'},
               { name: 'pink-600', hex: '#D81B60'},
               { name: 'pink-700', hex: '#C2185B'},
               { name: 'purple-300', hex: '#BA68C8'},
               { name: 'purple-400', hex: '#AB47BC'},
               { name: 'purple-500', hex: '#9C27B0'},
               { name: 'purple-600', hex: '#8E24AA'},
               { name: 'purple-700', hex: '#7B1FA2'},
               { name: 'deep-orange-300', hex: '#FF8A65'},
               { name: 'deep-orange-400', hex: '#FF7043'},
               { name: 'deep-orange-500', hex: '#FF5722'},
               { name: 'deep-orange-600', hex: '#F4511E'},
               { name: 'deep-orange-700', hex: '#E64A19'},
               { name: 'deep-purple-300', hex: '#9575CD'},
               { name: 'deep-purple-400', hex: '#7E57C2'},
               { name: 'deep-purple-500', hex: '#673AB7'},
               { name: 'deep-purple-600', hex: '#5E35B1'},
               { name: 'indigo-400', hex: '#5C6BC0'},
               { name: 'indigo-500', hex: '#3F51B5'},
               { name: 'indigo-600', hex: '#3949AB'},
               { name: 'indigo-700', hex: '#303F9F'},
               { name: 'blue-500', hex: '#2196F3'},
               { name: 'blue-600', hex: '#1E88E5'},
               { name: 'blue-700', hex: '#1976D2'},
               { name: 'blue-800', hex: '#1565C0'},
               { name: 'blue-900', hex: '#0D47A1'},
               { name: 'cyan-200', hex: '#80DEEA'},
               { name: 'cyan-300', hex: '#4DD0E1'},
               { name: 'cyan-400', hex: '#26C6DA'},
               { name: 'cyan-500', hex: '#00BCD4'},
               { name: 'cyan-600', hex: '#00ACC1'},
               { name: 'cyan-700', hex: '#0097A7'},
               { name: 'cyan-800', hex: '#00838F'},
               { name: 'cyan-900', hex: '#006064'},
               { name: 'green-300', hex: '#81C784'},
               { name: 'green-400', hex: '#66BB6A'},
               { name: 'green-500', hex: '#4CAF50'},
               { name: 'green-600', hex: '#43A047'},
               { name: 'yellow-400', hex: '#FFEE58'},
               { name: 'yellow-500', hex: '#FFEB3B'},
               { name: 'yellow-600', hex: '#FDD835'},
               { name: 'amber-300', hex: '#FFD54F'},
               { name: 'amber-400', hex: '#FFCA28'},
               { name: 'amber-500', hex: '#FFC107'},
               { name: 'amber-600', hex: '#FFC107'},
               { name: 'orange-300', hex: '#FFB74D'},
               { name: 'orange-400', hex: '#FFA726'},
               { name: 'orange-500', hex: '#FF9800'},
               { name: 'orange-600', hex: '#FB8C00'},
               { name: 'orange-700', hex: '#F57C00'}
           ]
        );

        this.set('shapeColors',
            [
                { name: 'red-600', hex: '#D81B60'},
                { name: 'red-700', hex: '#C2185B'},
                { name: 'pink-600', hex: '#D81B60'},
                { name: 'pink-700', hex: '#C2185B'},
                { name: 'purple-400', hex: '#AB47BC'},
                { name: 'purple-500', hex: '#9C27B0'},
                { name: 'purple-600', hex: '#8E24AA'},
                { name: 'deep-purple-500', hex: '#673AB7'},
                { name: 'deep-purple-600', hex: '#5E35B1'},
                { name: 'indigo-400', hex: '#5C6BC0'},
                { name: 'indigo-500', hex: '#3F51B5'},
                { name: 'indigo-600', hex: '#3949AB'},
                { name: 'blue-600', hex: '#1E88E5'},
                { name: 'blue-700', hex: '#1976D2'},
                { name: 'blue-800', hex: '#1565C0'},
                { name: 'light-blue-300', hex: '#4FC3F7'},
                { name: 'light-blue-400', hex: '#29B6F6'},
                { name: 'light-blue-500', hex: '#03A9F4'},
                { name: 'cyan-600', hex: '#00ACC1'},
                { name: 'cyan-700', hex: '#0097A7'},
                { name: 'cyan-800', hex: '#00838F'},
                { name: 'teal-600', hex: '#00897B'},
                { name: 'teal-700', hex: '#00796B'},
                { name: 'light-green-600', hex: '#7CB342'},
                { name: 'light-green-700', hex: '#689F38'},
                { name: 'orange-600', hex: '#FB8C00'},
                { name: 'orange-700', hex: '#F57C00'},
                { name: 'orange-800', hex: '#EF6C00'},
                { name: 'deep-orange-600', hex: '#F4511E'},
                { name: 'deep-orange-700', hex: '#E64A19'}
            ]
        );

    }
});
