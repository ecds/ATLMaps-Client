import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
    actions: {
        showLayerInfoDetals: function(layer) {
            if (Ember.$(".layer-info-detail."+layer).hasClass("layer-info-detail-active")) {
                Ember.$(".layer-info-detail-active").slideToggle().removeClass("layer-info-detail-active");
            }
            else if (!Ember.$(".layer-info-detail."+layer).hasClass("layer-info-detail-active")) {
                Ember.$(".layer-info-detail-active").slideToggle().removeClass("layer-info-detail-active");
                Ember.$(".layer-info-detail."+layer).slideToggle().addClass("layer-info-detail-active");
            }
        },

        closeMarkerInfo: function() {
            Ember.$("div.marker-data").hide();
            Ember.$(".active_marker").removeClass("active_marker");
            Ember.$(".vector-data.card").slideToggle();
            this.sendAction('activateVectorCard');
        },

        removeRasterLayer: function(layer){
            // Get the current route so we handle requests coming from both
            // `explore` and `project.edit`
            var route = this.controller.currentRouteName;
            // But we don't want the `.edit` junk on `route` when doing lookups.
            route = route.replace('\.edit', '');
            layer.set('active_in_project', false);
            var projectID = this.modelFor(route).get('id');
            var layerID = layer.get('id');
            var layerClass = layer.get('slug');

            var _this = this;

            this.modelFor(route).get('raster_layer_ids').removeObject(layer);

            var rasterLayerProject = DS.PromiseObject.create({
                promise: this.store.query('raster_layer_project', {
                    raster_layer_id: layerID, project_id: projectID
                })
            });

            rasterLayerProject.then(function(){
				console.log(rasterLayerProject);
                var rasterLayerProjectID = rasterLayerProject.get('content.content.0.id');

                _this.store.findRecord('raster_layer_project', rasterLayerProjectID).then(function(rasterLayerProject){
                    rasterLayerProject.destroyRecord().then(function(){});
                });
            });

            // Remove the layer from the map
            Ember.$(".leaflet-layer."+layerClass).fadeOut( 500, function() {
                Ember.$(this).remove();
            });

            // var controller = _this.controllerFor('project');
            // controller.send('initProjectUI', _this.modelFor('project'));
            // this.send('initProjectUI', this.modelFor(route));

        },

        removeVectorLayer: function(layer, model){
            // var layer = this.get('layer');
            console.log(model);
            // Get the current route so we handle requests coming from both
            // `explore` and `project.edit`
            // var route = this.controller.currentRouteName;
            // // But we don't want the `.edit` junk on `route` when doing lookups.
            // route = route.replace('\.edit', '');
            // var route = 'project';
            var projectID = model.get('id');
            layer.set('active_in_project', false);
            var layerID = layer.get('id');
            var layerClass = layer.get('slug');

            var _this = this;

            model.get('vector_layer_ids').removeObject(layer);

            var vectorLayerProject = DS.PromiseObject.create({
                promise: this.store.query('vector_layer_project', {
                    vector_layer_id: layerID, project_id: projectID
                })
            });

            vectorLayerProject.then(function(){
                var vectorLayerProjectID = vectorLayerProject.get('content.content.0.id');

                _this.store.findRecord('vector_layer_project', vectorLayerProjectID).then(function(vectorLayerProject){
                    vectorLayerProject.destroyRecord().then(function(){});
                });
            });

            // Remove the layer from the map
            Ember.$(".leaflet-marker-icon."+layerClass).fadeOut( 500, function() {
                Ember.$(this).remove();
            });

            // var controller = _this.controllerFor('project');
            // controller.send('initProjectUI', _this.modelFor('project'));
            // this.send('initProjectUI', this.modelFor(route));

        },
    }
});
