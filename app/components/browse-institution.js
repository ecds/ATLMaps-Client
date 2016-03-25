import Ember from 'ember';

export default Ember.Component.extend({

    browseParams: Ember.inject.service('browse-params'),

    classNames: ['browse-by-institution', 'browse-form'],

    actions: {
        checkInstitution(institution){
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
