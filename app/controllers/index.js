// TODO When auth is refactored, make me go away!
import Ember from 'ember';

const {
    Controller,
    inject: {
        service
    }
} = Ember;

export default Controller.extend({
    session: service()
});
