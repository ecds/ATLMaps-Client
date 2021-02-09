'use strict';

const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const BroccoliDebug = require('broccoli-debug');
/* eslint-disable node/no-extraneous-require */
const fastbootTransform = require('fastboot-transform');
  /* eslint-enable node/no-extraneous-require */
  const path = require('path');

module.exports = {
  name: require('./package').name,

  included(app) {
    let vendor = this.treePaths.vendor;
    let dir = `${vendor}/leaflet.vectorgrid`;

    // Main modules
    app.import(`${dir}/Leaflet.VectorGrid.bundled.js`);

    return this._super.included.apply(this, arguments);
  },

  treeForVendor(vendorTree) {
    let debugTree = BroccoliDebug.buildDebugCallback(this.name),
        trees = [];

    if (vendorTree) {
      trees.push(
        debugTree(vendorTree, 'vendorTree')
      );
    }

    let js = fastbootTransform(
      moduleToFunnel('leaflet.vectorgrid', {
        include: ['*.js'],
        destDir: 'leaflet.vectorgrid'
      })
    );

    trees.push(
      debugTree(js, 'leaflet.vectorgrid:js'),
    );

    return debugTree(mergeTrees(trees), 'mergedVendorTrees');
  }

};

function moduleToFunnel(moduleName, opts) {
  opts = opts || { destDir: moduleName };
  return new Funnel(resolveModulePath(moduleName), opts);
}

function resolveModulePath(moduleName) {
  return path.dirname(require.resolve(moduleName));
}