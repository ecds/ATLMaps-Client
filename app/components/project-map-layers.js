import Ember from 'ember';

export default Ember.Component.extend({
    mapObject: Ember.inject.service('map-object'),

    map: function(){
        return this.get('mapObject.map');
    }.property()
});
