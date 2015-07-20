import Ember from 'ember';

export default Ember.Component.extend({
	isShowingRasterModal: false,

    isShowingVectorModal: false,

    actions: {
    	toggleRasterModal: function(){
            this.toggleProperty('isShowingRasterModal');
        },

        toggleVectorModal: function(){
            this.toggleProperty('isShowingVectorModal');
        },
    }
});
