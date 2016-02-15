// ALL THE LOOK UP STUFF NEEDS TO GO TO THE MapLayer MODULE

import Ember from 'ember';
import MapLayer from '../map-layer';

export default Ember.Component.extend({
	classNames: ['col-xs-2', 'remove-layer-button'],

	actions: {
		addLayer: function(){

			var layer = this.get('layer');

			// this.sendAction('add', layer);
			new MapLayer(map, layer, marker, 0);
		},

		removeLayer: function(){

			var layer = this.get('layer');

			this.sendAction('remove', layer);
		}
	}
});
