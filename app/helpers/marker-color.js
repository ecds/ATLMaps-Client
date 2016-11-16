import Ember from 'ember';

const { Helper } = Ember;

export function markerColor(params) {
    // This is a helper to color the vector icons.
    let index = params[0] || 1;
    let [,markerColors, shapeColors, type] = params;
    let dataColor = '';

    if (type === 'point-data') {
        dataColor = markerColors[index].name;
    } else if (type === 'line-data' || type === 'polygon') {
        dataColor = shapeColors[index].name;
    }
    return `layer-${dataColor}`;

}

export default Helper.helper(markerColor);
