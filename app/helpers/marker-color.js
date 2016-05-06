import Ember from 'ember';

export function markerColor(params) {
    // This is a helper to color the vector icons.
    let index = params[0];
    let markerColors = params[1];
    let shapeColors = params[2];
    let type = params[3];
    let dataColor = '';
    if (type === 'point-data'){
        dataColor = Object.keys(markerColors)[index];
    }
    else {
        dataColor = Object.keys(shapeColors)[index];
    }

    return 'layer-' + dataColor;
}

export default Ember.Helper.helper(markerColor);
