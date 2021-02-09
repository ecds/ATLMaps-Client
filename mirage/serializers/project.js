import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  include: ['raster-layers', 'raster-layer-projects', 'vector-layers', 'vector-layer-projects']
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */
});