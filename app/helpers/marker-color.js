import Ember from 'ember';

export function markerColor(params) {
    let index = params[0];
    let colors = params[1];
    let dataColor = colors[index];
  return 'layer-' + dataColor;
}

export default Ember.Helper.helper(markerColor);
