import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  // Not ver worried about leaking state here, but the warning is a good one.
  // https://dockyard.com/blog/2015/09/18/ember-best-practices-avoid-leaking-state-into-factories
  include: ['raster-layers', 'raster-layer-projects', 'vector-layers', 'vector-layer-projects']
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */
});