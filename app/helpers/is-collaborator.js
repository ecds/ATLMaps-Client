import Ember from 'ember';

export function isCollaborator(params/*, hash*/) {
  return params;
}

export default Ember.HTMLBars.makeBoundHelper(isCollaborator);
