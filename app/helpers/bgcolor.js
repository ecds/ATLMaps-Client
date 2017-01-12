import Ember from 'ember';

const {
    Handlebars,
    Helper
} = Ember;

export function bgcolor(params /* hash */) {
    return new Handlebars.SafeString(`background-color: ${params[0]};`);
}

export default Helper.helper(bgcolor);
