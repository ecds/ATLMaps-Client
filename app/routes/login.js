import Ember from 'ember';

const {
    Route,
    inject: {
        service
    }
} = Ember;

export default Route.extend({
    session: service(),
    currentUser: service()
});
