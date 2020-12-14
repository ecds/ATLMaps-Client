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

  // set stepsMap(stepMap) {
  //   return stepMap;
  // }

  @computed('args.{layer.vectorProject.property,values}')
  get range() {
    if (!this.args.values) {
      this.stepsMap = this.args.layer.vectorProject.colorMap;
      return {
        min: this.args.layer.vectorProject.colorMap.firstObject.bottom,
        max: this.args.layer.vectorProject.colorMap.lastObject.top
      };
    }

    return {
      min: Math.floor(Math.min(...this.args.values)),
      max: Math.ceil(Math.max(...this.args.values))
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
}
