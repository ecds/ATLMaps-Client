import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default class VectorLayerProjectModel extends Model {
  @belongsTo('vectorLayer') vectorLayer;
  @belongsTo('project') project;
  @attr('string') color;
  @attr('number') order;
  @attr('string', {
    defaultValue(_this) {
      if (_this.get('vectorLayer.defaultBreakProperty')) {
        return _this.get('vectorLayer.defaultBreakProperty');
      }
    }
  }) property;
  @attr('number') steps;
  @attr('boolean') manualSteps;
  @attr('string') brewerScheme;
  @attr('string') brewerGroup;
  @attr('string') dataType;

  @computed('vectorLayer.show')
  get show() {
    return this.get('vectorLayer.show');
  }

  @attr({
    defaultValue(_this) {
      if (_this.get('vectorLayer.colorMap')) {
        return _this.get('vectorLayer.colorMap');
      }
      return null;
    }
  }) colorMap;

  @attr() leafletPane;

  @computed('colorMap')
  get hasColorMap() {
    if (!this.colorMap) return false;
    return Object.keys(this.colorMap).length > 0;
  }

  @computed('color', 'colorMap')
  get mainColor() {
    if (this.colorMap && Object.keys(this.colorMap).length > 0) {
      const middleKeyIndex = Object.keys(this.colorMap).length / 2;
      const middleKey = Object.keys(this.colorMap)[parseInt(middleKeyIndex)];
      return this.colorMap[middleKey].color ;
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

  @computed('project.vectorOnTop')
  get onTop() {
    return this.get('project.vectorOnTop') == this;
  }

  @computed('order', 'onTop')
  get zIndex() {
    let value = 500 - (this.order * 10);
    if (this.onTop) {
      value += 100;
    }
    return value;
  }

  // VectorTile Specific Properties

  @attr({ defaultValue() { return A([]); }}) vectorTileStyles;
}
