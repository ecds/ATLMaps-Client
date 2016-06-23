import Ember from 'ember';

export function markerColor(params) {
    // This is a helper to color the vector icons.
    let index = params[0] || 1;
    let markerColors = params[1];
    let shapeColors = params[2];
    let type = params[3];
    let dataColor = '';

    // console.log(type + ' ' + index);

    if (type === 'point-data'){
        dataColor = markerColors[index].name;
    }
    else {
        dataColor = shapeColors[index].name;
    }
    return 'layer-' + dataColor;

}

export default Ember.Helper.helper(markerColor);
