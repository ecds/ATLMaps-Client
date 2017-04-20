/**
 * @private
 * TODO: Do we need a component for this or can this be handled by the `browseParams`
 * service? Honestly, this is smelly.
 * Component to maintain state for a search by institution.
 */
import Ember from 'ember';

const {
    Component,
    inject: {
        service
    },
    get
} = Ember;

export default Component.extend({

    browseParams: service(),

    classNames: ['browse-by-institution'],

    actions: {
        /**
         * Adds or remove institution from filter.
         */
        checkInstitution(institution) {
            if (institution) {
                get(this, 'browseParams').addInstitution(institution);
                this.sendAction('getResults');
            }
        },

        removeInstitution(institution) {
            this.get('browseParams').removeInstution(institution);
            this.sendAction('getResults');
        }
    }
});
