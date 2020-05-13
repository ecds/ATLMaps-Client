import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'atlmaps-client/config/environment';

export default class MapComponent extends Component {

  @tracked map;
  lat = ENV.APP.CENTER_LAT;
  lng = ENV.APP.CENTER_LNG;
  zoom = ENV.APP.INITIAL_ZOOM;


  get _center() {
    if (!this.map) {
      return null;
    }
    return {lat: this.map.getCenter().lat.toString(), lng: this.map.getCenter().lng.toString()};
  }

  @action
  initMap(event) {
    this.map = event.target;
    this.map.zoomControl.setPosition('bottomleft');
  }
}
