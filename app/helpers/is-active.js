import Ember from 'ember';

export function isActive(params/*, hash*/) {
  return params;
}

export default Ember.HTMLBars.makeBoundHelper(isActive);
