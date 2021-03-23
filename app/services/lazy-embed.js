
// Simplified implementation of https://github.com/poteto/ember-lazy-video

import Service from '@ember/service';

export default class LazyEmbedService extends Service {
  youtubeRegex = /(https?:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/watch\?feature=player_embedded&v=|youtube\.com\/embed\/)([A-Za-z0-9_-]*)(\&\S+)?(\?\S+)?/;
  vimeoRegex   = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  instagramRegex = /(https?:\/\/)?(www.)?instagr(am\.com|\.am)\/p\/([A-Za-z0-9_-]*)/;

  getEmbedUrl(link) {
    if (this.vimeoRegex.test(link)) {
      const videoId = this.vimeoRegex.exec(link)[3];
      return `//player.vimeo.com/video/${videoId}`;
    }

    if (this.youtubeRegex.test(link)) {
      const videoId = this.youtubeRegex.exec(link)[4];
      return `//www.youtube.com/embed/${videoId}`;
    }

    if (this.instagramRegex.test(link)) {
      const videoId = this.instagramRegex.exec(link)[4];
      return `http://instagram.com/p/${videoId}/embed`;
    }
  }
}
