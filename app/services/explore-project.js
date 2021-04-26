import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ExploreProjectService extends Service {
  @service cookies;
  @service fastboot

  @tracked
  layers = { rasters: [], vectors: [] };

  @tracked
  canRestore = false;

  constructor() {
    super(...arguments);
    if (this.fastboot.isFastBoot) return;

    if (this.cookies.exists('cookieConsent') && this.cookies.exists('explore')) {
      this.canRestore = true;
      this.layers = JSON.parse(this.cookies.read('explore'));
    } else if (!this.cookies.exists('cookieConsent') && this.cookies.exists('explore')) {
      this.clearLayers();
    }
  }

  updateLayers(type, layers) {
    if (!this.cookies.exists('cookieConsent')) return;

    this.layers[type] = layers;
    if (this.cookies.exists('cookieConsent')) {
      this.cookies.write(
        'explore',
        JSON.stringify(this.layers)
      );
    }
  }

  clearLayers() {
    this.layers = { rasters: [], vectors: [] };
    this.cookies.clear('explore');
  }
}
