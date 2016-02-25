import Ember from 'ember';

export default Ember.Component.extend({

    browseParams: Ember.inject.service('browse-params'),

    serchTerms: 'dude',

    actions: {
        textSearch: function(){
            console.log(this.get('searchTerms'))
            this.get('browseParams').setSearchText(this.get('searchTerms'));
            this.sendAction('getResults');
        },
    }
});
