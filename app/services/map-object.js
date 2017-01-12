import Ember from 'ember';
import burgerMenu from 'ember-burger-menu';

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

export default Service.extend({

    dataColors: service(),
    vectorDetailContent: service(),

    init() {
        this._super(...arguments);
        set(this, 'map', '');
        set(this, 'leafletLayerGroup', L.layerGroup());
        set(this, 'leafletFeatureGroup', L.featureGroup());
        set(this, 'projectLayers', {
            rasters: {},
            vectors: {}
        });
        set(this, 'allBounds', L.latLngBounds());
        set(this, 'visiableRasters', false);
        set(this, 'visiableVectors', false);
    },

    createMap() {
        try {
            const atlmap = L.map('map', {
                center: [33.7489954, -84.3879824],
                zoom: 13,
                // zoomControl defaults to true
                // We add the zoom buttons just below to the top right.
                zoomControl: false
            });

            // Add some base layers
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
                className: 'street base'
            }).addTo(atlmap);

            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                className: 'satellite base',
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }).addTo(atlmap);

            // Zoom contorl, topright
            L.control.zoom({
                position: 'bottomright'
            }).addTo(atlmap);

            // TODO would it be better to also track the layers as a group?
            // this.get('leafletLayerGroup').addTo(atlmap);

            // Create the object for Leafet in the mapObject service.
            this.set('map', atlmap);
            return atlmap;
        } catch (err) {
            // Map is likely already initialized
            return false;
        }
    },

    setUpProjectMap(project) {
        const atlmap = get(this, 'map');
        atlmap.on('click', () => {
            // Hide the search pane.
            burgerMenu.set('open', false);
            // TODO: Refactor to remove jQuery syntax.
            $('div.vector-info').hide();
            $('.active-marker').removeClass('active-marker');
            $('.vector-content.marker-content').empty();
            project.setProperties({
                showing_browse_results: false
            });
            $('#toggleResultsCheck').attr('checked', false);
        });

        // Add all the vector layers to the map.
        const self = this;
        project.get('vector_layer_project_ids').then((vectors) => {
            vectors.forEach((vector) => {
                self.mapLayer(vector);
            });
        });

        // Add all the raster layers to the map.
        project.get('raster_layer_project_ids').then((rasters) => {
            rasters.forEach((raster) => {
                self.mapLayer(raster);
            });
        });

        atlmap.flyTo(
            L.latLng(
                project.get('center_lat'),
                project.get('center_lng')
            ), project.get('zoom_level')
        );

        $('.base').hide();

        $(`.${project.get('default_base_map')}`).show();
    },

    mapSingleLayer(layer) {
        const atlMap = this.get('map');
        const wmsLayer = L.tileLayer.wms(layer.get('url'), {
            layers: layer.get('layers'),
            format: 'image/png',
            transparent: true,
            mzxZoom: 18,
            // detectRetina: true,
            className: 'wms',
            // zIndex, // Enhanced litrial
            opacity: 1
        });

        get(this, 'projectLayers.rasters')[get(layer, 'slug')] = wmsLayer;
        this.get('leafletLayerGroup').addLayer(wmsLayer);
        set(layer, 'leaflet_id', this.get('leafletLayerGroup').getLayerId(wmsLayer));
        wmsLayer.addTo(atlMap);

        this.get('leafletLayerGroup').addLayer(wmsLayer);
        // _map.fitBounds(newBounds)
    },

    mapLayer(layer) {
        const self = this;
        const map = this.get('map');
        const zIndex = layer.get('position') + 10;

        layer.get(`${layer.get('data_format')}_layer_id`).then((newLayer) => {
            const newLayerTitle = newLayer.get('title');
            const newLayerSlug = newLayer.get('slug');
            const dataType = newLayer.get('data_type');
            const newLayerUrl = newLayer.get('url');
            newLayer.set('active_in_project', true);

            switch (dataType) {

                // case 'planningatlanta': {
                //
                //     let tile = L.tileLayer(`http://static.library.gsu.edu/ATLmaps/tiles/${newLayerName}/{z}/{x}/{y}.png`, {
                //         layer: newLayerSlug,
                //         tms: true,
                //         minZoom: 13,
                //         mzxZoom: 18,
                //         detectRetina: true
                //     }).addTo(map).setZIndex(10).getContainer();
                //
                //     $(tile).addClass(newLayerSlug).addClass('wmsLayer')
                //     .addClass('atLayer').css('zIndex', zIndex);
                //
                //     break;
                // }
                // case 'atlTopo': {
                //
                //     let topoTile = L.tileLayer('http://disc.library.emory.edu/atlanta1928topo/tilesTopo/{z}/{x}/{y}.jpg', {
                //         layer: newLayerSlug,
                //         tms: true,
                //         minZoom: 13,
                //         mzxZoom: 18,
                //         detectRetina: true,
                //         errorTileUrl: 'http://inspiresara.com/wp-content/uploads/2015/04/Peanut-butter-jelly-time.gif'
                //     }).addTo(map).setZIndex(10).getContainer();
                //
                //     $(topoTile).addClass(newLayerSlug).addClass('wmsLayer')
                //     .addClass('atLayer').css('zIndex', zIndex);
                //
                //     break;
                // }
                case 'wms':
                    {
                        const wmsLayer = L.tileLayer.wms(newLayerUrl, {
                            layers: newLayer.get('layers'),
                            format: 'image/png',
                            transparent: true,
                            mzxZoom: 18,
                            zIndex, // Enhanced litrial
                            opacity: 1
                        });

                        self.get('projectLayers.rasters')[newLayerSlug] = wmsLayer;

                        self.get('leafletLayerGroup').addLayer(wmsLayer);
                        wmsLayer.addTo(map);
                        newLayer.setProperties({
                            leaflet_id: self.get('leafletLayerGroup').getLayerId(wmsLayer),
                            leaflet_object: wmsLayer
                        });

                        wmsLayer.on('load', () => {});

                        // TODO make use of this
                        // wmsLayer.on("load",function() {
                        // console.log("all visible tiles have been loaded") });

                        break;
                    }

                case 'point-data':
                    {
                        const markerColors = self.get('dataColors.markerColors');
                        newLayer.setProperties({
                            colorName: markerColors[layer.get('marker')].name,
                            colorHex: markerColors[layer.get('marker')].hex

                        });
                        const layerClass = `${newLayerSlug} vectorData map-marker layer-${newLayer.get('colorName')}`;
                        const markerDiv = `<span class='vector-icon vector ${dataType} layer-${newLayer.get('colorName')}'></span>`;
                        if (newLayerUrl) {
                            const points = new L.GeoJSON.AJAX(newLayerUrl, {
                                pointToLayer(feature, latlng) {
                                    const icon = L.divIcon({
                                        className: layerClass,
                                        iconSize: null,
                                        html: '<div class="shadow"></div><div class="icon"></div>'
                                    });

                                    const marker = L.marker(latlng, {
                                        icon,
                                        title: newLayerTitle,
                                        markerDiv
                                    });
                                    // $('.carousel.carousel-slider').carousel({full_width: true});

                                    return marker;
                                },

                                onEachFeature: self.get('vectorDetailContent.viewData')
                            });
                            self.get('projectLayers.vectors')[newLayerSlug] = points;
                            self.get('leafletFeatureGroup').addLayer(points);
                            points.addTo(map);
                            newLayer.setProperties({
                                leaflet_id: self.get('leafletLayerGroup').getLayerId(points),
                                leaflet_object: points
                            });
                        }
                        break;
                    }
                case 'polygon':
                case 'line-data':
                    {
                        const shapeColors = self.get('dataColors.shapeColors');
                        newLayer.setProperties({
                            colorName: shapeColors[layer.get('marker')].name,
                            colorHex: shapeColors[layer.get('marker')].hex

                        });
                        const shapeLayerClass = `${newLayerSlug} vectorData map-marker layer-${newLayer.get('colorName')}`;
                        const vectorDiv = `<span class="atlmaps-ext vector-icon vector ${dataType} layer-${newLayer.get('colorName')}"></span>`;

                        const polyStyle = {
                            color: newLayer.get('colorHex'),
                            fillColor: newLayer.get('colorHex'),
                            className: shapeLayerClass,
                            interactive: true

                        };
                        if (newLayerUrl) {
                            const content = self.get('vectorDetailContent.viewData');
                            const vector = new L.GeoJSON.AJAX(newLayerUrl, {
                                style: polyStyle,
                                className: shapeLayerClass,
                                title: newLayerTitle,
                                markerDiv: vectorDiv,
                                onEachFeature: content
                            });
                            self.get('projectLayers.vectors')[newLayerSlug] = vector;
                            self.get('leafletFeatureGroup').addLayer(vector);
                            // set(newLayer, 'leaflet_id', self.get('leafletLayerGroup').getLayerId(vector));
                            // set(newLayer, 'leaflet_object', vector);
                            vector.addTo(map);
                            newLayer.setProperties({
                                leaflet_id: self.get('leafletLayerGroup').getLayerId(vector),
                                leaflet_object: vector
                            });
                        }
                        break;
                    }
            }
        });
    },

    updateVectorStyle(vector) {
        const slug = vector.get('slug');
        const dataType = vector.get('data_type');
        if (dataType === 'polygon') {
            this.get('projectLayers.vectors')[slug].setStyle({
                color: vector.get('colorHex'),
                fillColor: vector.get('colorHex')
            });
        } else if (dataType === 'line-data') {
            this.get('projectLayers.vectors')[slug].setStyle({
                color: vector.get('colorHex')
            });
        } else if (dataType === 'point-data') {
            // The Icon class doesn't have any methods like setStyle.
            $(`'.leaflet-marker-icon.${slug}`).css({
                color: vector.get('colorHex')
            });
        }
    }
});
