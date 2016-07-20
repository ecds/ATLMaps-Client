import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import LayerProject from './layer-project';

export default LayerProject.extend({
	data_format: attr(),
	position: attr(),
	raster_layer_id: belongsTo('raster_layer', {async: true, inverse: null}),

});
