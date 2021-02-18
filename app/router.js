import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('explore');
  this.route('projects');
  this.route('project', { path: 'projects/:project_id' });
  this.route('index', { path: '/' });
  this.route('layers', { path: 'layers/:name' });
  this.route('embed', { path: 'embed/:maps' });
});
