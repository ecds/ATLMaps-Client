import Ember from 'ember';

/* globals L */

export function wms(map) {
    // console.log(layer);
    L.tileLayer('http://disc.library.emory.edu/atlanta1928topo/tilesTopo/{z}/{x}/{y}.jpg', {
        layer: 'jerur7j-481',
        tms: true,
        minZoom: 13,
        maxZoom: 19,
    }).addTo(map).setZIndex(10).getContainer();
    // let zIndex = layer.get('position') + 10;
    //
    // L.tileLayer.wms(newLayerUrl, {
    //     layers: newLayer.get('layers'),
    //     format: 'image/png',
    //     crs: L.CRS.EPSG4326,
    //     transparent: true,
    //     detectRetina: true,
    //     className: newLayerSlug,
    //     zIndex: zIndex
    // }).addTo(map);
  // return params;
}

export default Ember.Helper.helper(wms);
