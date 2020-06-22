import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  include: ['raster-layers', 'raster-layer-projects', 'vector-layers', 'vector-layer-projects']
});