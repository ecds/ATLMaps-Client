import Ember from 'ember';
import DS from 'ember-data';

/* globals L, noUiSlider, Draggabilly */

export default Ember.Component.extend({

	initProjectUI: function(){
		var _this = this;
		var model = this.get('model');


            Ember.run.scheduleOnce('afterRender', function() {


                // Set up the map
                var map = _this.globals.mapObject;

                var osm = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors Georgia State University and Emory University',
                    detectRetina: true
                });
                
                var MapQuestOpen_Aerial = L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
                    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency contributors Georgia State University and Emory University',
                    subdomains: '1234',
                    detectRetina: true
                });

                osm.addTo(map);
                        
                var baseMaps = {
                    "Street": osm,
                    "Satellite": MapQuestOpen_Aerial
                };        
                
                var control = L.control.layers(baseMaps,null,{collapsed:false});//.addTo(_map);
                control._map = map;

                // Add a listiner for a click on the map to clear the 
                // info window.
                map.on('click', function(){
                    Ember.$("div.info").remove();
                    Ember.$("div.marker-data").hide();
                    Ember.$(".active_marker").removeClass("active_marker");
                });

                // We need to check if the layer controls are already added to the DOM.
                if (Ember.$('.leaflet-control-layers').length === 0) {
                    var controlDiv = control.onAdd(map);
                    Ember.$('.controls').append(controlDiv);
                }

                // Iniatate the dragging
                var draggie = new Draggabilly( '.draggable', {
                    handle: '.mdi-action-open-with'
                });

                // Draggabilly adds a style of position = relative to the
                // element. This prevents the abality to click through where
                // the div was originally. So we change it to absolute.
                draggie.element.style.position = 'absolute';

                draggie.on( 'dragStart', function( event, pointer ) {console.log(pointer);});

                var raster_layers = model.get('raster_layer_ids');

                Ember.$.each(raster_layers.content.currentState, function(index, raster_layer_id){
                    var projectLayer = DS.PromiseObject.create({
                        promise: _this.store.find('raster_layer', raster_layer_id.id)
                    });

                    projectLayer.then(function() {
                        _this.send('opacitySlider', projectLayer);
                    });
                });

                // Toggle the label for the show/hide all layers switch
                Ember.$("input#toggle-layer-opacity").change(function(){
                    Ember.$( "span.toggle_label" ).toggleClass( "off" );
                });

            });
	}.on('didInsertElement'),

	actions: {
		opacitySlider: function(layer){

            Ember.run.later(this, function() {

                var options = {
                    start: [ 10 ],
                    connect: false,
                    range: {
                        'min': 0,
                        'max': 10
                    }
                };
                var slider = document.getElementById(layer.get('slider_id'));

                // The slider drops out when we transition but noUiSlider thinks
                // the slider has already been initialized. So, if the slider is 
                // "initalized", we destroy. Otherwise, we just initalize it.
                try {
                    slider.noUiSlider.destroy();
                }
                catch(err){}

                noUiSlider.create(slider, options, true);

                // Change the opactity when a user moves the slider.
                var valueInput = document.getElementById(layer.get('slider_value_id'));
                slider.noUiSlider.on('update', function(values, handle){
                    valueInput.value = values[handle];
                    var opacity = values[handle] / 10;
                    Ember.$("#map div."+layer.get('layer')+",#map img."+layer.get('layer')).css({'opacity': opacity});
                });
                valueInput.addEventListener('change', function(){
                    slider.noUiSlider.set(this.value);
                });

                // Watch the toggle check box to show/hide all raster layers.
                var showHideSwitch = document.getElementById('toggle-layer-opacity');
                showHideSwitch.addEventListener('click', function(){
                    if (Ember.$("input#toggle-layer-opacity").prop("checked")){
                        slider.noUiSlider.set(10);
                    }
                    else{
                        slider.noUiSlider.set(0);
                    }
                });

            }, 2000);
        },
	}
});
