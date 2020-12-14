import { helper } from '@ember/component/helper';

export default helper(function vectorColor([vectorLayerProject, vectorFeature]) {
  const property = vectorFeature.geojson.properties[vectorLayerProject.property];
  const roundedProperty = Math.round(property);
  const colorMap = vectorLayerProject.colorMap;
  if (colorMap && Object.keys(colorMap).length > 0) {
    let color = 'blue';
    Object.keys(colorMap).forEach(key => {
      if (isNaN(property) && property.toUpperCase() == key.toUpperCase()) {
        color = colorMap[key].color;
      }
      else if (roundedProperty >= colorMap[key].bottom && roundedProperty <= colorMap[key].top) {
        color = colorMap[key].color;
      }
    });
    vectorFeature.setProperties(
      {
        color,
        style: `color: ${color};`
      }
    );
    return color;
  }
  return vectorLayerProject.color;
});
