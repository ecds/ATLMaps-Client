/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var leafletImages = funnel('bower_components/leaflet/dist/images', {
	destDir: 'assets/images',
});

var materialFonts = funnel('bower_components/bootstrap-material-design/fonts', {
	destDir: 'assets/material-font-path'
});

app.import('bower_components/bootstrap-material-design/dist/js/ripples.min.js');
app.import('bower_components/bootstrap-material-design/dist/js/material.min.js');
app.import('bower_components/leaflet/dist/leaflet.js');
app.import('bower_components/leaflet/dist/leaflet.css');
app.import('vendor/js/menu/classie.js');
app.import('vendor/js/menu/gnmenu.js');
app.import('vendor/js/shuffle.js');
app.import('vendor/js/local.js');

module.exports = mergeTrees([
	app.toTree(),
		leafletImages,
		materialFonts
	],{
		overwrite: true
	});
