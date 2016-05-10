import Ember from 'ember';

export function bgcolor(params/*, hash*/) {
  return new Ember.Handlebars.SafeString("background-color: " + params[0] + ";");
}

export default Ember.Helper.helper(bgcolor);
