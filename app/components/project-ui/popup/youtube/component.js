import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ProjectUiPopupYoutubeComponent extends Component {
  @service lazyEmbed;

  get embedUrl() {
    return this.lazyEmbed.getEmbedUrl(this.args.video);
  }
}
