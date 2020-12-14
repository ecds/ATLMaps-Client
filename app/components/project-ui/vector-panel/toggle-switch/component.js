import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MapUiVectorPanelToggleSwitchComponent extends Component {
  @action
  toggleVisible() {
    if (this.args.status) {
      this.args.project.get('vectors').forEach(vector => {
        vector.setProperties({ show: true });
      });
    } else {
      this.args.project.get('vectors').forEach(vector => {
        vector.setProperties({ show: false });
      });
    }
  }
}
