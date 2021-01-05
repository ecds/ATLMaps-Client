import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AskCookieConsentComponent extends Component {
  @service cookies;

  @tracked
  cookieConsent = true;

  @action
  checkConsent() {
    this.cookieConsent = this.cookies.exists('cookieConsent');
  }

  @action
  consent() {
    this.cookies.write('cookieConsent', true);
    this.cookieConsent = true;
  }

  @action
  decline() {
    this.cookieConsent = true;
  }

}
