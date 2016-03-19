import Ember from 'ember';

export function markerColor(params) {
    let index = params[0];
    let pointColors = params[1];
    let shapeColors = params[2];
    let type = params[3];
    let dataColor = '';
    if (type === 'point-data'){
        dataColor = pointColors[index];
    }
    else {
        dataColor = Object.keys(shapeColors)[index];
    }
    // This is never going to work b/c shape colors are hex codes
    return 'layer-' + dataColor;
}

export default Ember.Helper.helper(markerColor);
