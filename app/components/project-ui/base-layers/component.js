import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ProjectUiBaseLayersComponent extends Component {
  @service baseMaps;

  @action
  switchBase(base) {
    this.args.project.setProperties({
      _defaultBaseMap: base.label
    });
  }
}
