import Ember from 'ember';

const { Service, set } = Ember;

export default Service.extend({

    init() {
        this._super(...arguments);
        set(this, 'message', '');
        set(this, 'show', false);
    }
});
