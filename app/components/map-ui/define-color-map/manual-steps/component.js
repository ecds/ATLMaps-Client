import Component from '@glimmer/component';
import EmberObject, { computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class MapUiDefineColorMapManualStepsComponent extends Component {
  @tracked
  stepsMap = A([
    EmberObject.create({
      bottom: this.range.min,
      top: this.range.max
    })
  ]);

  set stepsMap(stepMap) {
    return stepMap;
  }

  @computed('property', 'geojson')
  get range() {
    let values = [];
    this.args.layer.vectorLayer.geojson.features.forEach(feature => values.push(feature.properties[this.args.property]));

    return {
      min: Math.floor(Math.min(...values)),
      max: Math.ceil(Math.max(...values))
    };
  }

  @action
  updateTop(step, event) {
    if (
      parseInt(event.target.value) < this.range.max
      && step == this.stepsMap.lastObject
    ) {
      this.stepsMap.addObject(
        EmberObject.create({
          bottom: parseInt(this.stepsMap.lastObject.top) + 1,
          top: Math.ceil(this.range.max)
        })
      );
    } else {
      this.stepsMap.forEach((_step, index) => {
        if (index == 0) return;
        _step.setProperties({ bottom: parseInt(this.stepsMap[index - 1].top) + 1});
      });
    }

    this.args.layer.vectorProject.setProperties(
      {
        colorMap: this.stepsMap,
        steps: this.stepsMap.length
      }
    );
  }

  @action
  addStep() {
    this.stepsMap.addObject(
      {
        bottom: parseInt(this.stepsMap.lastObject.top) + 1,
        top: Math.ceil(this.range.max)
      }
    );

    this.args.layer.vectorProject.setProperties(
      {
        colorMap: this.stepsMap,
        steps: this.stepsMap.length
      }
    );
  }
}
