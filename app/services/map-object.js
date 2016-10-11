import Ember from 'ember';

/* globals L */

// Service to hold the Leaflet object.

const {
    $,
    get,
    inject: {
        service
    },
    Service,
    set
} = Ember;

// const { max, min } = Math;

export default Service.extend({

    dataColors: service(),
    vectorDetailContent: service(),

    init() {
        this._super(...arguments);
        set(this, 'map', '');
        set(this, 'leafletGroup', L.layerGroup());
        set(this, 'projectLayers', {});
    },

    createMap() {
        try {
            let _map = L.map('map', {
                center: [33.7489954, -84.3879824],
                zoom: 13,
                // zoomControl is a Boolean
                // We add the zoom buttons just below to the top right.
                zoomControl: false
                // layers: [satellite, street]
            });

            // Create the object for Leafet in the mapObject service.
            this.set('map', _map);

            // Add some base layers
            L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
                className: 'street base'
            }).addTo(_map);

            L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/{scheme}/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}', {
                attribution: 'Map &copy; 2016 <a href="http://developer.here.com">HERE</a>',
                subdomains: '1234',
                base: 'aerial',
                type: 'maptile',
                scheme: 'satellite.day',
                app_id: '1Igi60ZMWDeRNyjXqTZo',
                app_code: 'eA64oCoCX3KZV8bwLp92uQ',
                mapID: 'newest',
                maxZoom: 20,
                language: 'eng',
                format: 'png8',
                size: '256',
                className: 'satellite base'
            }).addTo(_map);

            // Zoom contorl, topright
            L.control.zoom({
                position: 'topright'
            }).addTo(_map);

            // this.get('leafletGroup').addTo(_map);
            console.log('title', _map.getBounds());

            return _map;

        } catch (err) {
            // Map is likely already initialized
        }
    },

    setUpProjectMap(project) {
        let _map = get(this, 'map');
        _map.on('click', function() {
            $('div.vector-info').hide();
            $('.active_marker').removeClass('active_marker');
            $('.vector-content.marker-content').empty();
            project.setProperties({
                showing_browse_results: false
            });
        });

        // Add all the vector layers to the map.
        let _this = this;
        project.get('vector_layer_project_ids').then(function(vectors) {
            vectors.forEach(function(vector) {
                _this.mapLayer(vector);
            });
        });

        // Add all the raster layers to the map.
        project.get('raster_layer_project_ids').then(function(rasters) {
            rasters.forEach(function(raster) {
                _this.mapLayer(raster);
            });
        });

        _map.flyTo(
            L.latLng(
                project.get('center_lat'),
                project.get('center_lng')
            ), project.get('zoom_level')
        );

        $('.base').hide();

        $(`.${project.get('default_base_map')}`).show();
    },

    mapSingleLayer(layer) {
        let wmsLayer = L.tileLayer.wms(layer.get('url'), {
            layers: layer.get('layers'),
            format: 'image/png',
            transparent: true,
            maxZoom: 20,
            // detectRetina: true,
            className: 'wms',
            // zIndex, // Enhanced litrial
            opacity: 1
        });

        this.get('projectLayers')[layer.get('slug')] = wmsLayer;
        wmsLayer.addTo(this.get('map'));
        this.get('map').fitBounds([
            [layer.get('miny'), layer.get('minx')],
            [layer.get('maxy'), layer.get('maxx')]
        ]);
    },

    mapLayer(layer) {
        let _this = this;
        let map = this.get('map');
        let zIndex = layer.get('position') + 10;

        layer.get(`${layer.get('data_format')}_layer_id`).then(function(newLayer) {

            let newLayerName = newLayer.get('name');
            let newLayerTitle = newLayer.get('title');
            let newLayerSlug = newLayer.get('slug');
            let dataType = newLayer.get('data_type');
            // let west = newLayer.get('maxx');
            // let north = newLayer.get('maxy');
            // let east = newLayer.get('minx');
            // let south = newLayer.get('miny');

            // let newLayerInst = newLayer.get('institution.geoserver');
            // let newLayerWorkspace = newLayer.get('workspace');
            let newLayerUrl = newLayer.get('url');
            newLayer.set('active_in_project', true);

            switch (dataType) {

                case 'planningatlanta':

                    let tile = L.tileLayer(`http://static.library.gsu.edu/ATLmaps/tiles/${newLayerName}/{z}/{x}/{y}.png`, {
                        layer: newLayerSlug,
                        tms: true,
                        minZoom: 13,
                        maxZoom: 19,
                        detectRetina: true
                    }).addTo(map).setZIndex(10).getContainer();

                    $(tile).addClass(newLayerSlug).addClass('wmsLayer').addClass('atLayer').css('zIndex', zIndex);

                    break;

                case 'atlTopo':

                    let topoTile = L.tileLayer('http://disc.library.emory.edu/atlanta1928topo/tilesTopo/{z}/{x}/{y}.jpg', {
                        layer: newLayerSlug,
                        tms: true,
                        minZoom: 13,
                        maxZoom: 19,
                        detectRetina: true,
                        errorTileUrl: 'http://inspiresara.com/wp-content/uploads/2015/04/Peanut-butter-jelly-time.gif'
                    }).addTo(map).setZIndex(10).getContainer();

                    $(topoTile).addClass(newLayerSlug).addClass('wmsLayer').addClass('atLayer').css('zIndex', zIndex);

                    break;

                case 'wms':
                    let wmsLayer = L.tileLayer.wms(newLayerUrl, {
                        layers: newLayer.get('layers'),
                        format: 'image/png',
                        transparent: true,
                        maxZoom: 20,
                        // detectRetina: true,
                        // className: newLayerSlug,
                        zIndex, // Enhanced litrial
                        opacity: 1
                    });

                    // let layerObj = {name: newLayerSlug, mapObj: wmsLayer};
                    // layerObj[newLayerSlug] = wmsLayer;
                    _this.get('projectLayers')[newLayerSlug] = wmsLayer;

                    _this.get('leafletGroup').addLayer(wmsLayer);
                    wmsLayer.addTo(map);

                    // let northWest = L.latLng(west, north);
                    // let south = L.latLng(east, north);
                    // let west = L.latLng(west, south);
                    //
                    // let layerHeight = map.distance(northWest, south);
                    // let layerWidth = map.distance(west, northWest);
                    //
                    // let b = map.getBounds();
                    // let mapNorthEast = L.latLng(b.getNorth(), b.getEast());
                    // let mapSouthEast = L.latLng(b.getSouth(), b.getEast());
                    // let mapNorthWest = L.latLng(b.getNorth(), b.getWest());
                    // let mapHeight = map.distance(mapNorthEast, mapSouthEast);
                    // let mapWidth = map.distance(mapNorthEast, mapNorthWest);

                    // let layerBounds = L.latLngBounds(
                    //     L.latLng(south, west),
                    //     L.latLng(north, east)
                    // );

                    // console.log('map', newLayerTitle, newLayerSlug);

                    // console.log('layerBounds', layerBounds);
                    //
                    // console.log('b', b);

                    // console.log('contains', b.contains(layerBounds));

                    // SI = max(0, Max(XA2, XB2) - Min(XA1, XB1)) * Max(0, Max(YA2, YB2) - Min(YA1, YB1))
                    // console.log('b.getEast', b.getEast());
                    // let left = max(west, b.getWest());
                    // let right = min(east, b.getEast());
                    // let top = max(north, b.getNorth());
                    // let bottom = min(south, b.getSouth());
                    // console.log(left + ' < ' + right + ' && ' + bottom + ' < ' + top);
                    // console.log(west, b.getWest());
                    // console.log(east, b.getEast());
                    // if (left < right && bottom < top) {
                    //     console.log('intersects');
                    // } else {
                    //     console.log('no intersects');
                    // }
                    // console.log('*****');

                    // let latlngs = [
                    //     [north, east], // Northeast
                    //     [south, east], // Southeast
                    //
                    //     [south, east], // Southeast
                    //     [south, west], // Southwest
                    //
                    //     [south, west], // Southwest
                    //     [north, west], // Northwest
                    //
                    //     [north, west], // Northwest
                    //     [north, east]  // Northeast
                    // ];
                    // L.polyline(latlngs, { color: 'red' }).addTo(map);
                    //
                    // let grr = [
                    //     [b.getNorth(), b.getEast()],
                    //     [b.getSouth(), b.getEast()],
                    //
                    //     [b.getSouth(), b.getEast()],
                    //     [b.getSouth(), b.getWest()],
                    //
                    //     [b.getSouth(), b.getWest()],
                    //     [b.getNorth(), b.getWest()],
                    //
                    //     [b.getNorth(), b.getWest()],
                    //     [b.getNorth(), b.getEast()]
                    // ];
                    // L.polyline(grr, { color: 'blue' }).addTo(map);

                    // let SI = max(0, max(b.getNorth(), north) - min(b.getSouth(), south)) * max(0, max(b.getWest(), west) - min(b.getEast(), east));
                    //
                    // // su = (a.width * a.height) + (b.width * b.height) - si;
                    // let SU = mapWidth * mapHeight + (layerWidth * layerHeight);

                    // console.log('SU', SI / SU);

                    break;

                    // NOTE: At some point we'll move the vector data to GeoServer
                    // case 'wfs':
                    //  //http://geospatial.library.emory.edu:8081/geoserver/Sustainability_Map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Sustainability_Map:Art_Walk_Points&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON&callback=jQuery21106192189888097346_1421268179487&_=1421268179488
                    //  //http://geospatial.library.emory.edu:8081/geoserver/Sustainability_Map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Sustainability_Map:Art_Walk_Points&maxFeatures=50&outputFormat=text/javascript
                    //  var wfsLayer = institution.geoserver + layer.get('url') + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer.get('url') + ":" + layer.get('slug') + "&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON";

                    //  $.ajax(wfsLayer,
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

                    switch (dataType) {
                        case 'point-data':
                            let markerColors = _this.get('dataColors.markerColors');
                            newLayer.setProperties({
                                color_name: markerColors[layer.get('marker')].name,
                                color_hex: markerColors[layer.get('marker')].hex

                            });
                            let layerClass = `${newLayerSlug} vectorData map-marker layer-${newLayer.get('color_name')}`;
                            let markerDiv = `<span class='map-marker vector-icon vector ${dataType} layer-${newLayer.get('color_name')}'></span>`;
                            if (newLayerUrl) {
                                let points = new L.GeoJSON.AJAX(newLayerUrl, {
                                    pointToLayer(feature, latlng) {
                                        let icon = L.divIcon({
                                            className: layerClass,
                                            iconSize: null,
                                            html: '<div class="shadow"></div><div class="icon"></div>'
                                        });

                                        let marker = L.marker(latlng, {
                                            icon,
                                            title: newLayerTitle,
                                            markerDiv
                                        });

                                        return marker;
                                    },

                                    onEachFeature: _this.get('vectorDetailContent.viewData')
                                });
                                _this.get('projectLayers')[newLayerSlug] = points;
                                points.addTo(map);
                            }
                            break;

                        case 'polygon':
                        case 'line-data':

                            let shapeColors = _this.get('dataColors.shapeColors');
                            newLayer.setProperties({
                                color_name: shapeColors[layer.get('marker')].name,
                                color_hex: shapeColors[layer.get('marker')].hex

                            });
                            // let layerClass = newLayerSlug + ' atLayer vectorData map-marker layer-' + newLayer.get('color_name');
                            let shapeLayerClass = `${newLayerSlug} vectorData map-marker layer-${newLayer.get('color_name')}`;
                            let vectorDiv = `<div class="map-marker vector-icon vector pull-left ${dataType} layer-${newLayer.get('color_name')}"></div>`;

                            let polyStyle = {
                                'color': newLayer.get('color_hex'),
                                'fillColor': newLayer.get('color_hex'),
                                'className': shapeLayerClass

                            };
                            if (newLayerUrl) {
                                let content = _this.get('vectorDetailContent.viewData');
                                let vector = new L.GeoJSON.AJAX(newLayerUrl, {
                                    style: polyStyle,
                                    className: shapeLayerClass,
                                    title: newLayerTitle,
                                    markerDiv: vectorDiv,
                                    onEachFeature: content
                                });
                                _this.get('projectLayers')[newLayerSlug] = vector;
                                vector.addTo(map);
                            }
                            break;
                    }
                    break;
            }
        });
    },

    updateVectorStyle(vector) {
        let slug = vector.get('slug');
        let dataType = vector.get('data_type');
        if (dataType === 'polygon') {
            this.get('projectLayers')[slug].setStyle({
                color: vector.get('color_hex'),
                fillColor: vector.get('color_hex')
            });
        } else if (dataType === 'line-data') {
            this.get('projectLayers')[slug].setStyle({
                color: vector.get('color_hex')
            });
        } else if (dataType === 'point-data') {
            // The Icon class doesn't have any methods like setStyle.
            $(`'.leaflet-marker-icon.${slug}`).css({
                color: vector.get('color_hex')
            });
        }
    }
});
