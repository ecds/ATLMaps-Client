import Ember from 'ember';

export default Ember.Component.extend({
    dataColors: Ember.inject.service('data-colors'),

    shapeColors: this.dataColors.shapeColors

});
