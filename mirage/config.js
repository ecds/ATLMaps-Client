export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

    this.get('/projects');
    this.post('/projects');
    this.get('/projects/:id');
    this.put('/projects/:id');
    this.get('/raster-layer-projects/:id');
    this.get('/raster-layers/:id');
    this.get('/raster-layers');
    this.get('/vector-layers');
    this.get('/categories');
    this.put('/vector-layer-projects/:id');
    this.post('/vector-layer-projects');
    this.del('/vector-layer-projects/:id');
    this.post('/raster-layer-projects');
    this.post('/raster-layer-projects/:id');
    this.del('/raster-layer-projects/:id');
    this.put('/raster-layer-projects/:id');
    this.del('/tokens/');
    this.get('/users/me');
    this.get('users/:id');
    this.get('/institutions');


    // this.post('/posts');
    // this.get('/posts/:id');
    // this.put('/posts/:id'); // or this.patch
    // this.del('/posts/:id');

    // https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
}
