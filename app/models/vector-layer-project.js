import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default class VectorLayerProjectModel extends Model {
  @belongsTo('vectorLayer') vectorLayer;
  @belongsTo('project') project;
  @attr('string') color;
  @attr('number') order;
  @attr('string') property;
  @attr('number') steps;
  @attr('boolean') manualSteps;
  @attr('string') brewerScheme;
  @attr('string') brewerGroup;
  @attr('string') dataType;
  @attr() colorMap;
  @attr() leafletPane;

  @computed('vectorLayer.show')
  get show() {
    return this.get('vectorLayer.show');
  }

  @computed('colorMap')
  get hasColorMap() {
    if (!this.colorMap && !this.get('vectorLayer.colorMap')) return false;
    if (this.colorMap) {
      return Object.keys(this.colorMap).length > 0 ;
    } else if (this.get('vectorLayer.colorMap')) {
      return Object.keys(this.get('vectorLayer.colorMap')).length > 0 ;
    }
    return false;
  }

  @computed('color', 'colorMap')
  get mainColor() {
    if (this.colorMap && Object.keys(this.colorMap).length > 0) {
      const middleKeyIndex = Object.keys(this.colorMap).length / 2;
      const middleKey = Object.keys(this.colorMap)[parseInt(middleKeyIndex)];
      return this.colorMap[middleKey].color;
    }
    else if (this.dataType == 'qualitative' && this.color) {
      return this.color;
    }
    return this.get('vectorLayer.tmpColor');
  }

  @computed('colorMap', 'color')
  get style() {
    return `color: ${this.mainColor};`;
  }

  @computed('project.datumOnTop')
  get onTop() {
    return this.get('project.datumOnTop') == this;
  }

  @computed('order', 'onTop')
  get zIndex() {
    let value = 500 - (this.order * 10);
    if (this.onTop) {
      value += 100;
    }
    if (this.leafletPane) {
      this.leafletPane.style.zIndex = value;
    }
    return value;
  }

  // VectorTile Specific Properties

  @attr({ defaultValue() { return A([]); }}) vectorTileStyles;
}
