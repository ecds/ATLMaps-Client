import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DeviceContextService extends Service {
  @service fastboot;

  windowWidth = this.windowWidth || null;
  windowHeight = this.windowHeight || null;
  @tracked deviceContextClass = this.deviceContextClass || 'atlm-desktop';
  @tracked isDesktop = this.isDesktop || true;
  @tracked isMobile = !this.isDesktop;
  @tracked isLandscape = this.isLandscape || false;

  constructor() {
    super(...arguments);
    if (this.fastboot.isFastBoot) return;

    this.setDeviceContext();

    window.addEventListener('resize', () => {
      this.setDeviceContext();
    });
  }

  setDeviceContext(context=null) {
    if (context) {
      this.isDesktop = context == 'desktop';
      this.deviceContextClass = `atlm-${context}`;
    } else {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;

      if (this.windowHeight < this.windowWidth) {
        this.isLandscape = true;
      }

      if (this.windowWidth > 1080) {
        this.deviceContextClass = 'atlm-desktop';
        this.isDesktop = true;
      } else {
        this.deviceContextClass = 'atlm-mobile';
        this.isDesktop = false;
      }
    }
  }
}
