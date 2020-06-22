import { helper } from '@ember/component/helper';

export default helper(function vectorColor([vectorLayerProject, vectorFeature, dataColors]) {
  if (vectorLayerProject.marker) {
    let color = null;
    if (vectorFeature.geometryType == 'Point'){
      color = dataColors.markerColors[vectorLayerProject.marker];
    } else {
      color = dataColors.shapeColors[vectorLayerProject.marker];
    }
    vectorFeature.setProperties({ color });
    vectorFeature.get('vectorLayer').setProperties({ tempColor: color });
    return color.hex;
  }
  const property = vectorFeature.geojson.properties[vectorLayerProject.property];
  const colorMap = vectorLayerProject.colorMap;
  let color = 'deeppink';
  Object.keys(colorMap).forEach(key => {
    if (isNaN(property) && property == key) {
      color = colorMap[key].color;
    }
    else if (property >= colorMap[key].bottom && property <= colorMap[key].top) {
      color = colorMap[key].color;
    }
  });
  vectorFeature.setProperties({ color });
  return color;
});
