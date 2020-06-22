import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DeviceContextService extends Service {
  @service fastboot;

  deviceContextClass = this.deviceContextClass || 'desktop';
  windowWidth = this.windowWidth || null;
  @tracked isDesktop = this.isDesktop || true;

  constructor() {
    super(...arguments);
    if (this.fastboot.isFastBoot) return;

    this.setDeviceContext();

    window.addEventListener('resize', () => {
      this.setDeviceContext();
    });
  }

  setDeviceContext() {
    this.windowWidth = window.innerWidth;

    if (this.windowWidth > 640) {
      this.deviceContextClass = 'atlm-desktop';
      this.isDesktop = true;
    } else {
      this.deviceContextClass = 'atlm-mobile';
      this.isDesktop = false;
    }
  }
}
