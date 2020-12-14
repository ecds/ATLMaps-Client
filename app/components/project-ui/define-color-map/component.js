import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { modal, util } from 'uikit';

export default class ProjectUiDefineColorMapComponent extends Component {
  @service colorBrewer;
  @service fastboot;

  @tracked start = true;
  @tracked numberValues = true;
  @tracked values = null;

  @computed('args.layer.vectorProject.{brewerGroup,steps}')
  get colorBrewerColors() {
    // if (this.args.layer) {
    return this.colorBrewer.getGroup(this.args.layer.vectorProject.brewerGroup, this.args.layer.vectorProject.steps);
    // }
    // return null;
  }

  @action
  initModal(element) {
    if (this.fastboot.isFastBoot) return;

    if (this.args.edit) {
      this.start = false;
      this.args.layer.vectorLayer
        .get('properties')
        .mapBy(this.args.layer.vectorProject.property)
        .forEach(prop => {
          if (prop) {
            this.setValues(prop);
          }
        });
    } else {
      this.args.layer.vectorProject.setProperties({ colorMap: {} });
    }

    let modalOptions = { bgClose: false };

    if (this.args.isTesting) {
      modalOptions.container = '#container';
    }
    this.colorModal = modal(element, modalOptions);
    util.on(element, 'beforehide', () => {
      this.start = true;
      this.numberValues = true;
      this.args.cancel();
    });
    this.colorModal.show();
  }

  @action
  back() {
    if (this.args.layer) {
      this.args.layer.vectorProject.setProperties(
        {
          brewerGroup: null,
          steps: null,
          property: null,
          colorMap: {}
        }
      );
      // this.args.layer.vectorProject.rollbackAttributes();
    }
  }

  @action
  setProperty(values, event) {
    this.start = false;
    this.setValues(values);
    this.args.layer.vectorProject.setProperties({ property: event.target.value });
    if (this.numberValues == false) {
      this.setUpColorMap();
    }
  }

  @action
  setBrewerScheme(event) {
    if (this.args.layer.vectorProject.manualSteps) {
      let colors = this.colorBrewer.getGroup(this.args.layer.vectorProject.brewerGroup, this.args.layer.vectorProject.steps)[event.target.value];
      let _colorMap = this.args.layer.vectorProject.colorMap;
      _colorMap.forEach((step, index) => {
        step.color = colors[index];
      });
      this.args.layer.vectorProject.setProperties({ colorMap: _colorMap });
    } else {
      this.args.layer.vectorProject.setProperties({
        brewerScheme: event.target.value
      });
    }
  }

  @action
  setGroup(event) {
    this.args.layer.vectorProject.setProperties({ brewerGroup: event.target.value });
  }

  @task
  *reloadLayer() {
    this.args.layer.vectorProject.setProperties({ show: false });
    yield this.args.layer.vectorProject.save();
    this.args.layer.vectorProject.setProperties({ show: true });
    this.colorModal.hide();
  }

  setValues(values) {
    this.values = values;
    this.numberValues = values.every(v => Number.isFinite(+v));
  }

  setUpColorMap() {
    let colorMap = {};
    this.values.sort().forEach(value => {
      colorMap[value.toLowerCase()] = { color: this.colorBrewer.getRandom() };
    });
    this.args.layer.vectorProject.setProperties({ colorMap });
  }
}
