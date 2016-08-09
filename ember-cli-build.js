/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

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
	   },
	   sourcemaps: {
		   enabled: !isProductionLikeBuild
	   },
	   minifyCSS: { enabled: isProductionLikeBuild },
	   minifyJS: { enabled: isProductionLikeBuild }
	});

	var funnel = require('broccoli-funnel');
	var mergeTrees = require('broccoli-merge-trees');

	var leafletImages = funnel('bower_components/leaflet/dist/images', {
		destDir: 'assets/images',
	});

	var trumbowygImages = funnel('bower_components/trumbowyg/dist/ui/images', {
		destDir: 'assets/images',
	});

	app.import('bower_components/leaflet/dist/leaflet.js');
	app.import('bower_components/leaflet-ajax/dist/leaflet.ajax.min.js');
	app.import('bower_components/jquery.easing/js/jquery.easing.min.js');
	app.import('bower_components/nouislider/distribute/nouislider.min.js');
	app.import('bower_components/list.js/dist/list.min.js');
	app.import('bower_components/js-cookie/src/js.cookie.js');
	app.import('bower_components/trumbowyg/dist/trumbowyg.min.js');
	app.import('bower_components/Swiper/dist/js/swiper.min.js');
    app.import('bower_components/interact/dist/interact.min.js');

	app.import('bower_components/blueimp-md5/js/md5.js');

    app.import('bower_components/leaflet/dist/leaflet.css');
	app.import('bower_components/trumbowyg/dist/ui/trumbowyg.min.css');
	app.import('bower_components/Swiper/dist/css/swiper.min.css');

	return mergeTrees([
		app.toTree(),
		leafletImages,
		trumbowygImages
	],{
		overwrite: true
	});
};
