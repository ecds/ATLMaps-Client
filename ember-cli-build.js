/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

// Migrate Brocfile.js to ember-cli-build.js
// Following this guide: https://github.com/ember-cli/ember-cli/blob/master/TRANSITION.md#user-content-brocfile-transition

module.exports = function() {
	var env = EmberApp.env();
	var isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;

	var app = new EmberApp({
		fingerprint: {
			enabled: isProductionLikeBuild,
	    	prepend: 'https://s3.amazonaws.com/atlmaps-' + env + '/'
		},
		sassOptions: {
			includePaths: [
		    'node_modules/ember-modal-dialog/app/styles/ember-modal-dialog'
		  ]
		}
	});

	// var config = {
	//   "production":"https://s3.amazonaws.com/atlmaps-prod/",
	//   "staging": "https://s3.amazonaws.com/atlmaps-staging/"
	// };

	// if (config[env]){
	// 	app.fingerprint = {
	// 		enabled: true,
	// 		prepend: config["staging"]
	// 	};
	// }

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

	// var materialFonts = funnel('bower_components/bootstrap-material-design/fonts', {
	// 	destDir: 'assets/material-font-path'
	// });

	var trumbowygImages = funnel('bower_components/trumbowyg/dist/ui/images', {
		destDir: 'assets/images',
	});

	// app.import('bower_components/bootstrap-material-design/dist/js/material.min.js');
	// app.import('bower_components/bootstrap-material-design/dist/js/ripples.min.js');
	app.import('bower_components/leaflet/dist/my-leaflet.js');
	app.import('bower_components/leaflet-ajax/dist/leaflet.ajax.min.js');
	app.import('bower_components/jquery.easing/js/jquery.easing.min.js');
	app.import('bower_components/Sortable/Sortable.min.js');
	app.import('bower_components/draggabilly/dist/draggabilly.pkgd.min.js');
	app.import('bower_components/nouislider/distribute/nouislider.min.js');
	app.import('bower_components/list.js/dist/list.min.js');
	app.import('bower_components/leaflet/dist/leaflet-1.css');
	app.import('bower_components/js-cookie/src/js.cookie.js');
	app.import('bower_components/trumbowyg/dist/trumbowyg.min.js');
	app.import('bower_components/osmbuildings/dist/OSMBuildings-Leaflet.js');
	app.import('bower_components/Swiper/dist/js/swiper.min.js');

	app.import('vendor/js/local.js');
	app.import('bower_components/blueimp-md5/js/md5.js');
	app.import('bower_components/resizeThis/resizeThis.js');

	app.import('bower_components/trumbowyg/dist/ui/trumbowyg.min.css');
	app.import('bower_components/Swiper/dist/css/swiper.min.css');
	// app.import('bower_components/bootstrap-material-design/dist/css/ripples.min.css');

	return mergeTrees([
		app.toTree(),
		leafletImages,
		trumbowygImages
	],{
		overwrite: true
	});
};
