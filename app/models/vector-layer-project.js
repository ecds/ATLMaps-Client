import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class VectorLayerProjectModel extends Model {
  @service dataColors;

  @belongsTo('vectorLayer') vectorLayer;
  @belongsTo('project') project;
  @attr('number', {
    defaultValue(_this) { return _this.get('vectorLayer.tempColorIndex'); }
  }) marker;
  @attr('number') order;
  @attr('string') property;
  @attr('number') steps;
  @attr('boolean') manualSteps;
  @attr('string') brewerScheme;
  @attr('string') brewerGroup;

  @computed('vectorLayer.opacity')
  get show() {
    if (this.get('vectorLayer.opacity') == 0) return false;
    return true;
  }

  set show(set) {
    return set;
  }

  @attr() colorMap;
  @attr() leafletPane;

  @computed('marker', 'colorMap')
  get color() {
    console.log('!!!!!!', this.colorMap, this.get('vectorLayer.dataType'))
    if (this.get('vectorLayer.dataType') == 'Point') {
      return this.dataColors.markerColors[this.marker];
    } else if (Object.keys(this.colorMap).length > 0) {
      const middleKeyIndex = Object.keys(this.colorMap).length / 2;
      const middleKey = Object.keys(this.colorMap)[parseInt(middleKeyIndex)];
      return { hex: this.colorMap[middleKey].color };
    }
    return this.dataColors.shapeColors[this.marker];
  }

  @computed('marker', 'colorMap', 'color')
  get style() {
    if (this.color) {
      return `color: ${this.color.hex};`;
    }
    return `color: ${this.get('vectorLayer.tempColor').hex};`;
  }

  @computed('order')
  get onTop() {
    return this.order == 1;
  }
}
