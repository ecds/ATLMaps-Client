import Ember from 'ember';

export default Ember.Component.extend({

    browseParams: Ember.inject.service('browse-params'),

    actions: {
        checkInstitution(institution){
            console.log(institution.get('name'));
            if (institution.get('checked') === true) {
                this.get('browseParams').removeInstution(institution);
            }
            else if (institution.get('checked') === false) {
                this.get('browseParams').addInstitution(institution);
            }
            institution.toggleProperty('checked');
            this.sendAction('getResults');
        }
    }
});
