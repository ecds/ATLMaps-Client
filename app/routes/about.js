import Ember from 'ember';

export default Ember.Route.extend({
    dataColors: Ember.inject.service('data-colors'),

    colors: function() {
        return this.get('dataColors.shapeColors');
    }.property()
});
