import Ember from 'ember';

const {
    Component,
    inject: {
        service
    }
} = Ember;

export default Component.extend({

    browseParams: service(),

    classNames: ['browse-by-institution'],

    actions: {
        checkInstitution(institution) {
            if (institution.get('checked') === true) {
                this.get('browseParams').removeInstution(institution);
            } else if (institution.get('checked') === false) {
                this.get('browseParams').addInstitution(institution);
            }
            institution.toggleProperty('checked');
            this.sendAction('getResults');
        }
    }
});
