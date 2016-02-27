import Ember from 'ember';

var globals = Ember.Object.extend({
  // mapObject: 'gahhhhh',
  color_options: ["amber-300","amber-400","amber-500","amber-600","blue-200","blue-300","blue-400","blue-500","blue-600","blue-700","blue-800","blue-900","cyan-200","cyan-300","cyan-400","cyan-500","cyan-600","cyan-700","cyan-800","cyan-900","deep-orange-300","deep-orange-400","deep-orange-500","deep-orange-600","deep-orange-700","deep-purple-300","deep-purple-400","deep-purple-50","deep-purple-500","deep-purple-600","green-300","green-400","green-500","green-600","indigo-400","indigo-500","indigo-600","indigo-700","light-blue-300","light-blue-400","light-blue-500","light-blue-600","light-blue-700","light-green-300","light-green-400","light-green-500","light-green-600","light-green-700","orange-300","orange-400","orange-500","orange-600","orange-700","pink-400","pink-500","pink-600","pink-700","purple-300","purple-400","purple-500","purple-600","purple-700","red-300","red-400","red-500","red-600","red-700","teal-300","teal-400","teal-500","teal-600","teal-700","yellow-400","yellow-500","yellow-600"],
  vector_colors: ["#ffd54f","#ffca28","#ffc107","#ffb300","#90caf9","#64b5f6","#42a5f5","#2196f3","#1e88e5","#1976d2","#1565c0","#80deea","#4dd0e1","#26c6da","#00bcd4","#00acc1","#0097a7","#00838f","#006064","#ff8a65","#ff7043","#ff5722","#f4511e","#e64a19","#9575cd","#7e57c2","#673ab7","#5e35b1","#81c784","#66bb6a","#4caf50","#43a047","#5c6bc0","#3f51b5","#3949ab","#303f9f","#4fc3f7","#29b6f6","#03a9f4","#039be5","#0288d1","#aed581","#9ccc65","#8bc34a","#7cb342","#689f38","#ffb74d","#ffa726","#ff9800","#fb8c00","#f57c00","#ec407a","#e91e63","#d81b60","#c2185b","#ba68c8","#ab47bc","#9c27b0","#8e24aa","#7b1fa2","#e57373","#ef5350","#f44336","#e53935","#d32f2f","#4db6ac","#26a69a","#009688","#00897b","#00796b","#ffee58","#ffeb3b","#fdd835","#E91E63","#2196F3"]
});

export default {
  name: "Globals",

  initialize: function(registry, application) {
    registry.typeInjection('component', 'store', 'store:main');
    application.register('global:variables', globals, {singleton: true});
    application.inject('route', 'globals', 'global:variables');
    application.inject('component', 'globals', 'global:variables');
    application.inject('controller', 'globals', 'global:variables');
  }
};
