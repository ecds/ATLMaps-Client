import Ember from 'ember';
/* globals L */

export default Ember.Component.extend({
    dataColors: Ember.inject.service('data-colors'),
    vectorDetailContent: Ember.inject.service('vector-detail-content'),
    classNames: ['fullscreen-map'],

    mapLayer(layer){
        let _this = this;
        let map = this.get('map');
        let zIndex = layer.get('position') + 10;
        let markerColor = this.get('dataColors.markerColors')[layer.get('marker')];
        let shapeColors = this.get('dataColors.shapeColors');
        function shapeColor(){
            let colorName = Object.keys(shapeColors)[layer.get('marker')];
            return shapeColors[colorName];
        }

        console.log(layer.get('url'))

        // layer.get(layer.get('data_format')+'_layer_id').then(function(newLayer) {

        let newLayer = layer;

            let newLayerName = newLayer.get('name');
            let newLayerSlug = newLayer.get('slug');
            // let newLayerInst = newLayer.get('institution.geoserver');
            // let newLayerWorkspace = newLayer.get('workspace');
            let newLayerUrl = newLayer.get('url');
            console.log(newLayerUrl)
            newLayer.set('active_in_project', true);

            switch(newLayer.get('data_type')) {

                case 'planningatlanta':

                    var tile = L.tileLayer('http://static.library.gsu.edu/ATLmaps/tiles/' + newLayerName + '/{z}/{x}/{y}.png', {
                        layer: newLayerSlug,
                        tms: true,
                        minZoom: 13,
                        maxZoom: 19,
                        detectRetina: true
                    }).addTo(map).setZIndex(10).getContainer();

                    Ember.$(tile).addClass(newLayerSlug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

                    break;

                case 'atlTopo':

                    var topoTile = L.tileLayer('http://disc.library.emory.edu/atlanta1928topo/tilesTopo/{z}/{x}/{y}.jpg', {
                        layer: newLayerSlug,
                        tms: true,
                        minZoom: 13,
                        maxZoom: 19,
                        detectRetina: true
                    }).addTo(map).setZIndex(10).getContainer();

                    Ember.$(topoTile).addClass(newLayerSlug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

                    break;

                case 'wms':
                    L.tileLayer.wms(newLayerUrl, {
                        layers: newLayer.get('layers'),
                        format: 'image/png',
                        crs: L.CRS.EPSG4326,
                        transparent: true,
                        detectRetina: true,
                        className: newLayerSlug,
                        zIndex: zIndex
                    }).addTo(map);

                    // Ember.$(wmsLayer).addClass(newLayerSlug).addClass('atLayer').css("zIndex", zIndex);

                    break;

                // NOTE: At some point we'll move the vector data to GeoServer
                // case 'wfs':
                //  //http://geospatial.library.emory.edu:8081/geoserver/Sustainability_Map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Sustainability_Map:Art_Walk_Points&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON&callback=jQuery21106192189888097346_1421268179487&_=1421268179488
                //  //http://geospatial.library.emory.edu:8081/geoserver/Sustainability_Map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Sustainability_Map:Art_Walk_Points&maxFeatures=50&outputFormat=text/javascript
                //  var wfsLayer = institution.geoserver + layer.get('url') + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer.get('url') + ":" + layer.get('slug') + "&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON";

                //  Ember.$.ajax(wfsLayer,
                //      { dataType: 'jsonp' }
                //      ).done(function ( data ) {});

                //  // This part is the magic that makes the JSONP work
                //  // The string at the beginning of the JSONP is processJSON
                //  function processJSON(data) {
                //      points = wfsLayer(data,{
                //          //onEachFeature: onEachFeature,
                //          pointToLayer: function (feature, latlng) {
                //              return L.marker(latlng);
                //          }
                //      }).addTo(map);
                //  }

                //  break;

                case 'point-data':
                case 'polygon':
                case 'line-data':


                    var layerClass = newLayerSlug + ' atLayer vectorData map-marker layer-' + markerColor;

                    let polyStyle = {
                            'color': shapeColor(),
                            'fillColor': shapeColor(),
                            'className': layerClass

                    };

                    if(newLayerUrl){

                        var vector = new L.GeoJSON.AJAX(newLayerUrl, {
                            style: polyStyle,
                            className: layerClass,
                            pointToLayer: function (feature, latlng) {
                                var icon = L.divIcon({
                                    className: layerClass,
                                    iconSize: null,
                                    html: '<div class="shadow"></div><div class="icon"></div>',
                                });

                                var marker = L.marker(latlng, {icon: icon});

                                return marker;
                            },
                            // onEachFeature: viewData,
                            onEachFeature: _this.get('vectorDetailContent.viewData')
                        });
                        vector.addTo(map);
                    }
                    break;
            }
        // });
    },

    didInsertElement(){
        let map = this.get('mapObject').createMap('project');
    }
});
