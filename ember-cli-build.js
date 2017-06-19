/* jshint node:true*/
/* global require, module */

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
var nodeSass = require('node-sass'); // loads the version in your package.json

module.exports = function(defaults) {
    var env = EmberApp.env();
    var isProductionLikeBuild = ['production :('].indexOf(env) > -1;

    var app = new EmberApp(defaults, {

        materializeDefaults: {
            modalIsFooterFixed: false,
            buttonIconPosition: 'left',
            loaderSize: 'big',
            loaderMode: 'indeterminate',
            modalContainerId: 'materialize-modal-root-element',
            dropdownInDuration: 300,
            dropdownOutDuration: 300
        },

        emberComposableHelpers: {
            only: ['toggle']
        },

        // fingerprint: {
        //     enabled: isProductionLikeBuild,
        //     prepend: 'https://s3.amazonaws.com/atlmaps-' + env + '/'
        // },

        sassOptions: {
            includePaths: [
                'node_modules/ember-modal-dialog/app/styles/ember-modal-dialog',
                'bower_components/materialize/sass'
            ],
            nodeSass // Workaround for ember-cli-sass bug https://github.com/aexmachina/ember-cli-sass/issues/117
        },

        sourcemaps: {
            enabled: !isProductionLikeBuild
        },

        minifyCSS: { enabled: isProductionLikeBuild },
        minifyJS: { enabled: isProductionLikeBuild }
    });

    var funnel = require('broccoli-funnel');
    // var mergeTrees = require('broccoli-merge-trees');

    var leafletImages = funnel('bower_components/leaflet/dist/images', {
        destDir: 'assets/images'
    });

    var fa = funnel('bower_components/font-awesome/fonts/', {
        destDir: 'assets/fonts'
    });

    var trumbowyg = funnel('bower_components/trumbowyg/dist/ui', {
        destDir: 'assets/ui'
    })

    app.import('bower_components/leaflet/dist/leaflet.js');
    app.import('bower_components/leaflet-ajax/dist/leaflet.ajax.min.js');
    app.import('bower_components/materialize/dist/js/materialize.min.js');
    app.import('bower_components/nouislider/distribute/nouislider.min.js');
    // app.import('bower_components/list.js/dist/list.min.js');
    app.import('bower_components/js-cookie/src/js.cookie.js');
    app.import('bower_components/trumbowyg/dist/trumbowyg.min.js');
    // TODO this is for the drag and drop for reorderings.
    // use HTML5 instead.
    app.import('bower_components/interact/dist/interact.min.js');

    app.import('bower_components/blueimp-md5/js/md5.js');

    app.import('bower_components/leaflet/dist/leaflet.css');
    app.import('bower_components/trumbowyg/dist/ui/trumbowyg.min.css');
    app.import('bower_components/nouislider/distribute/nouislider.min.css');

    // return mergeTrees([
    //     app.toTree(),
    //     leafletImages,
    //     trumbowygImages
    // ], {
    //     overwrite: true
    // });
    return app.toTree([leafletImages, fa, trumbowyg]); // , ckeditorPath]);
};
