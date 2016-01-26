import Ember from 'ember';
import DS from 'ember-data';

/* global L */

export default Ember.Route.extend({

	beforeModel: function(){

    },

    // model: function(params) {
    //     return this.store.findRecord('project', params.project_id);
    // },

    afterModel: function(model) {
    	// Update the page title:
        var projectTitle = this.modelFor('project').get('name');
        Ember.$(document).attr('title', 'ATLMaps: ' + projectTitle);

		this.setHeadTags(model);
    },

	setHeadTags: function (model) {
	   var headTags = [{
	     type: 'meta',
	     tagId: 'meta-description-tag',
	     attrs: {
	       name: 'foo',
	       content: model.get('name')
	     }
	   }];

	   this.set('headTags', headTags);
   },

    actions: {

    	didTransition: function() {

	    	var raster_layers = this.modelFor('project').get('raster_layer_ids');

            var vector_layers = this.modelFor('project').get('vector_layer_ids');

            var project = this.modelFor('project');

            var project_id = project.get('id');

	        var _this = this;

	        var controller = this.controllerFor('project');

            Ember.run.scheduleOnce('afterRender', function() {
                _this.send('initProjectUI', _this.modelFor('project'));

                // just leaving this here so I remember how to do it.
                var map = _this.globals.mapObject;
                // console.log(map.getBounds());
                map.panTo(new L.LatLng(project.get('center_lat'), project.get('center_lng')));
                map.setZoom(project.get('zoom_level'));

                var controller = _this.controllerFor('project');

                // controller.send('initProjectUI', _this.modelFor('project'));
                //_this.send('initProjectUI', _this.modelFor('project'));

    	        // Send some info to the ProjectController to
    	        // add the raster layers.
                // And oh my, this is ugly!
                Ember.$.each(raster_layers.content.currentState, function(index, raster_layer_id){
                    var rasterLayer = DS.PromiseObject.create({
                        promise: _this.store.find('raster_layer', raster_layer_id.id)
                    });

                    var rasterLayerProjectInfo = DS.PromiseObject.create({
                        promise: _this.store.query('raster_layer_project', {
                            project_id: project_id, raster_layer_id: raster_layer_id.id
                        })
                    });


                    // If we need to do anything to the promise objects we
                    // will need to add a `then` function. eg:
                    // `layer.then(function() {});`

                    // Make an array of the above promise objects.
                    var rasterPromises = [rasterLayer, rasterLayerProjectInfo];

                    // _this the promisies have been resolved, send them to the `mapLayer`
                    // action on the controler.
                    Ember.RSVP.allSettled(rasterPromises).then(function(){
                        var position = rasterLayerProjectInfo.content.content[0]._data.position;

                        // Only add the to the map if it donesn't already exixt in the DOM
                        // This is to prevent layers from adding more than one instance when
                        // transitioning between veiw and edit.
                        if (Ember.$('.atLayer.'+rasterLayer.get('slug')).length === 0) {
                            controller.send('mapLayer',
                                rasterLayer,
                                0,
                                position
                            );
                        }

                        //_this.send('orderRasterLayers');
                    });
                });

            });

            // Now send the vector layers
	        Ember.$.each(vector_layers.content.currentState, function(index, vector_layer_id) {
	        	var vectorLayer = DS.PromiseObject.create({
            		promise: _this.store.find('vector_layer', vector_layer_id.id)
        		});

        		var vectorLayerProjectInfo = DS.PromiseObject.create({
            		promise: _this.store.query('vector_layer_project', {
            			project_id: project_id, vector_layer_id: vector_layer_id.id
            		})
        		});

        		// Make an array of the above promise objects.
        		var vectorPromises = [vectorLayer, vectorLayerProjectInfo];

        		// _this the promisies have been resolved, send them to the `mapLayer`
        		// action on the controler.
        		Ember.RSVP.allSettled(vectorPromises).then(function(){

        			// Good lord this is also really ugly.
        			// var marker = vectorLayerProjectInfo.content.content[0]._data.marker;
                    var marker = vectorLayerProjectInfo.get('firstObject')._internalModel._data.marker;

                    // Only add the to the map if it donesn't already exixt in the DOM
                    // This is to prevent layers from adding more than one instance when
                    // transitioning between veiw and edit.
                    if (Ember.$('.atLayer.'+vectorLayer.get('slug')).length === 0) {
            			controller.send('mapLayer',
    	        			vectorLayer,
    	        			marker,
                            0
    	        		);
                    }

	        		// _this.send('colorIcons', vectorLayer, marker);


        		});

	        });

	    },

        // addVectorLayer: function(layer){

        //     var project_id = this.modelFor('project').get('id');

        //     layer.set('active_in_project', true);

        //     // Here we use `unshiftObject` instead of `pushObject` to prepend
        //     // the new layer to the list of layers.
        //     this.modelFor('project').get('vector_layer_ids').unshiftObject(layer);

        //     var _this = this;

        //     var controller = _this.controllerFor('project');
        //     var colors = _this.globals.color_options;
        //     var marker = Math.floor((Math.random() * colors.length) + 1);
        //     var projectID = _this.get('controller.model.id');

        //     var vectorLayerProject = _this.store.createRecord('vector_layer_project', {
        //         project_id: projectID,
        //         vector_layer_id: layer.get('id'),
        //         marker: marker,
        //         layer_type: layer.get('layer_type'),
        //     });

        //     vectorLayerProject.save();

        //     controller.send('mapLayer',
        //         layer,
        //         marker,
        //         0
        //     );

        //     var addedLayers = DS.PromiseObject.create({
        //         promise: _this.store.query('vector_layer_project', {
        //             project_id: project_id
        //         })
        //     });

        //     addedLayers.then(function() {

        //         Ember.$.each(addedLayers.content.content, function(index, layer_id) {

        //             var layer = DS.PromiseObject.create({
        //                 promise: _this.store.query('layer', layer_id._data.vector_layer_id)
        //             });

        //             var savedMarker = DS.PromiseObject.create({
        //                 promise: _this.store.query('vector_layer_project', {
        //                     project_id: project_id, vector_layer_id: layer_id._data.vector_layer_id
        //                 })
        //             });

        //             var promises = [layer, savedMarker];

        //             Ember.RSVP.allSettled(promises).then(function(){
        //                 var marker = savedMarker.content.content[0]._data.marker;
        //                 _this.send('colorIcons', layer, marker);
        //             });
        //         });

        //         var newLayer = DS.PromiseObject.create({
        //             promise: _this.store.query('layer', layer.get('id'))
        //         });

        //         newLayer.then(function(){
        //             _this.send('colorIcons', layer, marker);
        //         });

        //     });

        //     //this.send('initProjectUI', this.modelFor('project'));

        // },

        // remvoeRasterLayer: function(layer){
        //     layer.set('active_in_project', false);
        //     var projectID = this.modelFor('project').get('id');
        //     var layerID = layer.get('id');
        //     var layerClass = layer.get('slug');
        //     var _this = this;

        //     this.modelFor('project').get('raster_layer_ids').removeObject(layer);

        //     var rasterLayerProject = DS.PromiseObject.create({
        //         promise: this.store.query('raster_layer_project', {
        //             raster_layer_id: layerID, project_id: projectID
        //         })
        //     });

        //     rasterLayerProject.then(function(){
        //         var rasterLayerProjectID = rasterLayerProject.get('content.content.0.id');

        //         _this.store.query('raster_layer_project', rasterLayerProjectID).then(function(rasterLayerProject){
        //             rasterLayerProject.destroyRecord().then(function(){});
        //         });
        //     });

        //     // Remove the layer from the map
        //     Ember.$("."+layerClass).fadeOut( 500, function() {
        //         Ember.$(this).remove();
        //     });

        //     //var controller = _this.controllerFor('project');
        //     // controller.send('initProjectUI', _this.modelFor('project'));
        //     this.send('initProjectUI', this.modelFor('project'));

        // },

        // removeRasterLayer: function(layer){
        //     layer.set('active_in_project', false);
        //     var projectID = this.modelFor('project').get('id');
        //     var layerID = layer.get('id');
        //     var layerClass = layer.get('slug');

        //     var _this = this;

        //     this.modelFor('project').get('raster_layer_ids').removeObject(layerID);

        //     var rasterLayerProject = DS.PromiseObject.create({
        //         promise: this.store.query('raster_layer_project', {
        //             raster_layer_id: layerID, project_id: projectID
        //         })
        //     });

        //     rasterLayerProject.then(function(){
        //         var rasterLayerProjectID = rasterLayerProject.get('content.content.0.id');

        //         _this.store.query('raster_layer_project', rasterLayerProjectID).then(function(rasterLayerProject){
        //             rasterLayerProject.destroyRecord().then(function(){});
        //         });
        //     });

        //     // Remove the layer from the map
        //     Ember.$("."+layerClass).fadeOut( 500, function() {
        //         Ember.$(this).remove();
        //     });

        //     // var controller = _this.controllerFor('project');
        //     // controller.send('initProjectUI', _this.modelFor('project'));
        //     this.send('initProjectUI', this.modelFor('project'));

        // },

        // removeVectorLayer: function(layer){
        //     layer.set('active_in_project', false);
        //     var projectID = this.modelFor('project').get('id');
        //     var layerID = layer.get('id');
        //     var layerClass = layer.get('slug');

        //     var _this = this;

        //     this.modelFor('project').get('vector_layer_ids').removeObject(layer);

        //     var vectorLayerProject = DS.PromiseObject.create({
        //         promise: this.store.query('vector_layer_project', {
        //             vector_layer_id: layerID, project_id: projectID
        //         })
        //     });

        //     vectorLayerProject.then(function(){
        //         var vectorLayerProjectID = vectorLayerProject.get('content.content.0.id');

        //         _this.store.query('vector_layer_project', vectorLayerProjectID).then(function(vectorLayerProject){
        //             vectorLayerProject.destroyRecord().then(function(){});
        //         });
        //     });

        //     // Remove the layer from the map
        //     Ember.$(".leaflet-marker-icon."+layerClass).fadeOut( 500, function() {
        //         Ember.$(this).remove();
        //     });

        //     // var controller = _this.controllerFor('project');
        //     // controller.send('initProjectUI', _this.modelFor('project'));
        //     this.send('initProjectUI', this.modelFor('project'));

        // },



        //opacitySlider: function(layer){

            // Ember.run.later(this, function() {

            //     var options = {
            //         start: [ 10 ],
            //         connect: false,
            //         range: {
            //             'min': 0,
            //             'max': 10
            //         }
            //     };
            //     var slider = document.getElementById(layer.get('slider_id'));

            //     // The slider drops out when we transition but noUiSlider thinks
            //     // the slider has already been initialized. So, if the slider is
            //     // "initalized", we destroy. Otherwise, we just initalize it.
            //     try {
            //         slider.noUiSlider.destroy();
            //     }
            //     catch(err){}

            //     noUiSlider.create(slider, options, true);

            //     // Change the opactity when a user moves the slider.
            //     var valueInput = document.getElementById(layer.get('slider_value_id'));
            //     slider.noUiSlider.on('update', function(values, handle){
            //         valueInput.value = values[handle];
            //         var opacity = values[handle] / 10;
            //         Ember.$("#map div."+layer.get('slug')+",#map img."+layer.get('slug')).css({'opacity': opacity});
            //     });
            //     valueInput.addEventListener('change', function(){
            //         slider.noUiSlider.set(this.value);
            //     });

            //     // Watch the toggle check box to show/hide all raster layers.
            //     var showHideSwitch = document.getElementById('toggle-layer-opacity');
            //     showHideSwitch.addEventListener('click', function(){
            //         if (Ember.$("input#toggle-layer-opacity").prop("checked")){
            //             slider.noUiSlider.set(10);
            //         }
            //         else{
            //             slider.noUiSlider.set(0);
            //         }
            //     });

            // }, 2000);
        //},

        // showLayerInfoDetals: function(layer) {
        //     if (Ember.$(".layer-info-detail."+layer).hasClass("layer-info-detail-active")) {
        //         Ember.$(".layer-info-detail-active").slideToggle().removeClass("layer-info-detail-active");
        //     }
        //     else if (!Ember.$(".layer-info-detail."+layer).hasClass("layer-info-detail-active")) {
        //         Ember.$(".layer-info-detail-active").slideToggle().removeClass("layer-info-detail-active");
        //         Ember.$(".layer-info-detail."+layer).slideToggle().addClass("layer-info-detail-active");
        //     }
        // },

        // closeMarkerInfo: function() {
        //     Ember.$("div.marker-data").hide();
        //     Ember.$(".active_marker").removeClass("active_marker");
        // },

        // colorIcons: function(layer, marker){
        //     Ember.run.later(this, function() {
        //         Ember.$("span.geojson."+layer.get('layer_type')+"."+layer.get('slug')).addClass("map-marker layer-"+this.globals.color_options[marker]);
        //     }, 1500);
        // },

        // editProject: function(model) {
        //     var _this = this;
        //     var rasterLayers = model.get('raster_layer_ids');
        //     Ember.$.each(rasterLayers.content.currentState, function(index, raster_layer_id){
        //         var rasterLayer = DS.PromiseObject.create({
        //             promise: _this.store.query('raster_layer', raster_layer_id.id)
        //         });

        //         rasterLayer.then(function() {
        //             _this.send('opacitySlider', rasterLayer);
        //         });
        //     });
        //     this.toggleProperty('isEditing');
        //     this.send('initProjectUI', model);
        //     model.rollback();
        // },

        // snapBack: function(){
        //     Ember.$(".draggable").animate({left: '0', top:'0', width: '420px'}, 100);
        // },

        // orderRasterLayers: function(){
        //     // This sorts all the raster layers by the `data-position` attribute.
        //     var list = Ember.$('#layer_sort');
        //     var listItems = list.find('div.raster-layer').sort(function(a,b){
        //         return Ember.$(b).attr('data-position') - Ember.$(a).attr('data-position');
        //     });
        //     list.find('div.raster-layer').remove();
        //     list.append(listItems);
        // }

    },

});
