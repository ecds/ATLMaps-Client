import Ember from 'ember';

var globals = Ember.Object.extend({
  mapObject: 'gahhhhh',
  color_options: ["amber-300","amber-400","amber-500","amber-600","blue-200","blue-300","blue-400","blue-500","blue-600","blue-700","blue-800","blue-900","cyan-200","cyan-300","cyan-400","cyan-500","cyan-600","cyan-700","cyan-800","cyan-900","deep-orange-300","deep-orange-400","deep-orange-500","deep-orange-600","deep-orange-700","deep-purple-300","deep-purple-400","deep-purple-50","deep-purple-500","deep-purple-600","green-300","green-400","green-500","green-600","indigo-400","indigo-500","indigo-600","indigo-700","light-blue-300","light-blue-400","light-blue-500","light-blue-600","light-blue-700","light-green-300","light-green-400","light-green-500","light-green-600","light-green-700","orange-300","orange-400","orange-500","orange-600","orange-700","pink-400","pink-500","pink-600","pink-700","purple-300","purple-400","purple-500","purple-600","purple-700","red-300","red-400","red-500","red-600","red-700","teal-300","teal-400","teal-500","teal-600","teal-700","yellow-400","yellow-500","yellow-600"]
});

export default {
  name: "Globals",

  initialize: function(container, application) {
    container.typeInjection('component', 'store', 'store:main');
    application.register('global:variables', globals, {singleton: true});
    application.inject('route', 'globals', 'global:variables');
    application.inject('component', 'globals', 'global:variables');
    application.inject('controller', 'globals', 'global:variables');
  }
};