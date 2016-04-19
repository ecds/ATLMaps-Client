import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    dataColors: Ember.inject.service('data-colors'),

    colors: function() {
        let foo = this.get('dataColors.shapeColors');
        console.log(foo);
        return foo;
    }.property()
});
