import Ember from 'ember';

export default Ember.Service.extend({
    init(){
        this.set('map', '');
    },
    createMap(lMap){
        this.setProperties({map: lMap});
    }
});
