import Ember from 'ember';
// brining in Leaflet
/* global L */

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
        set(this, 'baseMaps', {});
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
            const street = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
                maxZoom: 18,
                className: 'street base'
            });

            const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                className: 'satellite base',
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            });

            set(this, 'baseMaps', {
                street,
                satellite
            });

            // Zoom contorl, topright
            L.control.zoom({
                position: 'bottomright'
            }).addTo(atlmap);

            // TODO would it be better to also track the layers as a group?
            // this.get('leafletLayerGroup').addTo(atlmap);

            // Create the object for Leafet in the mapObject service.
            this.set('map', atlmap);
            return atlmap;
        } catch(err) {
            // Map is likely already initialized
            return false;
        }
    },

    setUpProjectMap(project) {
        const { baseMaps, map } = this;
        // TODO: Move this to common remove function.
        map.on('click', () => {
            get(this, 'vectorDetailContent').removePopup();
            project.setProperties({
                showingSearch: false
            });
            $('#toggleResultsCheck').attr('checked', false);
        });

        // Add all the vector layers to the map.
        project.get('vector_layer_project_ids').then((vectors) => {
            vectors.forEach((vector) => {
                this.mapLayer(vector);
            });
        });

        // Add all the raster layers to the map.
        project.get('raster_layer_project_ids').then((rasters) => {
            rasters.forEach((raster) => {
                this.mapLayer(raster);
            });
        });

        map.flyTo(
            L.latLng(
                project.get('center_lat'),
                project.get('center_lng')
            ), project.get('zoom_level')
        );

        baseMaps[get(project, 'default_base_map')].addTo(map);
    },

    mapSingleLayer(layer) {
        const self = this;
        const map = get(this, 'map');
        const markerColors = get(this, 'dataColors.markerColors');
        const shapeColors = get(this, 'dataColors.shapeColors');
        const markerColorIndex = Math.floor(Math.random() * markerColors.length);
        const markerColor = markerColors[markerColorIndex];
        const shapeColorIndex = Math.floor(Math.random() * shapeColors.length);
        const shapeColor = shapeColors[shapeColorIndex];

        switch (get(layer, 'data_type')) {
        case 'wms':
            {
                const wmsLayer = self.mapWms(layer);
                wmsLayer.addTo(map);
                layer.setProperties({
                    leaflet_object: wmsLayer
                });

                // TODO make use of this
                wmsLayer.on('load', () => {});

                break;
            }
        case 'point-data':
            {
                layer.setProperties({
                    layerClass: `${get(layer, 'data-type')} map-marker vector-icon layer-${markerColor.name}`,
                    // layer-list-item-icon vector-icon layer-deep-orange-700 line-data
                    colorName: markerColor.name,
                    colorHex: markerColor.hex
                });
                const points = self.mapPoints(layer);
                self.get('projectLayers.vectors')[get(layer, 'slug')] = points;
                self.get('leafletFeatureGroup').addLayer(points);
                points.addTo(map);
                layer.setProperties({
                    leaflet_object: points
                });
                break;
            }
        case 'polygon':
        case 'line-data':
            {
                layer.setProperties({
                    layerClass: `${get(layer, 'slug')} layer-${shapeColor.name}`,
                    colorName: shapeColor.name,
                    colorHex: shapeColor.hex
                });
                const vector = self.mapPaths(layer);
                self.get('projectLayers.vectors')[get(layer, 'slug')] = vector;
                self.get('leafletFeatureGroup').addLayer(vector);
                vector.addTo(map);
                layer.setProperties({
                    leaflet_object: vector
                });
                break;
            }
        default: return true;
        }
        return true;
    },

    mapWms(layer, zIndex = 10) {
        const wmsLayer = L.tileLayer.wms(layer.get('url'), {
            layers: layer.get('layers'),
            format: 'image/png',
            transparent: true,
            mzxZoom: 18,
            zIndex,
            opacity: 1
        });

        this.get('leafletLayerGroup').addLayer(wmsLayer);
        this.get('projectLayers.rasters')[layer.get('slug')] = wmsLayer;

        return wmsLayer;
    },

    mapPoints(layer) {
        // console.log('class', get(layer, 'layerClass'));
        const points = new L.GeoJSON.AJAX(get(layer, 'url'), {
            pointToLayer(feature, latlng) {
                const icon = L.divIcon({
                    className: get(layer, 'layerClass'),
                    iconSize: null,
                    html: '<div class="shadow"></div><div class="icon"></div>'
                });

                const marker = L.marker(latlng, {
                    color: get(layer, 'colorName'),
                    icon,
                    title: get(layer, 'title'),
                    markerDiv: `<div class='${get(layer, 'layerClass')}'><div class='icon' /></div>`
                });
                return marker;
            },

            onEachFeature: this.get('vectorDetailContent.viewData')
        });

        layer.setProperties({ leaflet_object: points });
        return points;
    },

    mapPaths(layer) {
        const shapeLayerClass = `${get(layer, 'slug')} layer-${get(layer, 'colorName')}`;

        const polyStyle = {
            color: get(layer, 'colorHex'),
            fillColor: get(layer, 'colorHex'),
            className: shapeLayerClass,
            interactive: true
        };

        const geojson = new L.GeoJSON.AJAX(get(layer, 'url'), {
            style: polyStyle,
            // className: shapeLayerClass,
            title: get(layer, 'title'),
            markerDiv: `<span class="layer-list-item-icon vector-icon vector ${get(layer, 'data_type')} layer-${get(layer, 'colorName')}"></span>`,
            onEachFeature: this.get('vectorDetailContent.viewData')
        });

        return geojson;
    },

    mapLayer(layer) {
        const self = this;
        const map = this.get('map');

        layer.get(`${layer.get('data_format')}_layer_id`).then((newLayer) => {
            const newLayerSlug = newLayer.get('slug');
            const dataType = newLayer.get('data_type');
            newLayer.set('active_in_project', true);

            switch (dataType) {
            case 'wms':
                {
                    const wmsLayer = self.mapWms(newLayer);
                    wmsLayer.addTo(map);
                    newLayer.setProperties({
                        leaflet_object: wmsLayer
                    });

                    // TODO make use of this
                    wmsLayer.on('load', () => {});

                    break;
                }

            case 'point-data':
                {
                    newLayer.setProperties({
                        layerClass: `${newLayerSlug} vectorData map-marker layer-${layer.get('colorName')}`,
                        colorName: layer.get('colorName'),
                        colorHex: layer.get('colorHex')

                    });
                    const points = self.mapPoints(newLayer);
                    self.get('projectLayers.vectors')[newLayerSlug] = points;
                    self.get('leafletFeatureGroup').addLayer(points);
                    points.addTo(map);
                    // newLayer.setProperties({
                    //     leaflet_object: points
                    // });
                    break;
                }
            case 'polygon':
            case 'line-data':
                {
                    newLayer.setProperties({
                        colorName: layer.get('colorName'),
                        colorHex: layer.get('colorHex')

                    });
                    const vector = self.mapPaths(newLayer);
                    self.get('projectLayers.vectors')[newLayerSlug] = vector;
                    self.get('leafletFeatureGroup').addLayer(vector);
                    vector.addTo(map);
                    newLayer.setProperties({
                        leaflet_object: vector
                    });
                    break;
                }
            default:
                return true;
            }
            return true;
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
            const domClass = `.${slug}`;
            $(domClass).css('color', get(vector, 'colorHex'));
        }
    }
});
