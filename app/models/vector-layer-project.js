import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import LayerProject from './layer-project';

export default LayerProject.extend({
	vector_layer_id: belongsTo('vector_layer', {
		async: true,
		inverse: null
	}),
	marker: attr(),
});
