module.exports = function(grunt) {
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/js/<%= pkg.name %>.js',
        dest: 'build/js/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      add_banner: {
        options: {
          banner: '/* My minified css file. Last build: <%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        files: {
          'build/css/<%= pkg.name %>.min.css': ['src/css/*.css']
        }
      }
    },
    wiredep: {
      
      task: {
        
        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
        '**/*.html',   // .html support...
        '**/*.jade',   // .jade support...
        'styles/main.scss',  // .scss & .sass support...
        'config.yml'         // and .yml & .yaml support out of the box!
        ],
        
        options: {
          // See wiredep's configuration documentation for the options
          // you may pass:
          
          // https://github.com/taptapship/wiredep#configuration
          exclude: [
                    'bower_components/ember-simple-auth/simple-auth.amd.js',
                    'bower_components/ember-simple-auth/simple-auth-cookie-store.js',
                    'bower_components/ember-simple-auth/simple-auth-cookie-store.amd.js',
                    'bower_components/ember-simple-auth/simple-auth-devise.js',
                    'bower_components/ember-simple-auth/simple-auth-devise.amd.js',
                    'bower_components/ember-simple-auth/simple-auth-oauth2.amd.js',
                    'bower_components/ember-simple-auth/simple-auth-torii.js',
                    'bower_components/ember-simple-auth/simple-auth-torii.amd.js',
                    'bower_components/ember-simple-auth/simple-auth-testing.js',
                    'bower_components/ember-simple-auth/simple-auth-testing.amd.js'
                    ],
        }
      }
    },
    bower: {
      dev: {
        
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-bower');
  
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Load the plugin that finds your components and injects them directly into the HTML.
  grunt.loadNpmTasks('grunt-wiredep');
  
  //Load the plugin that provides CSS minification task.
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  // Default task(s).
  // grunt.registerTask('default', ['uglify','cssmin','bower','wiredep']);
  
  grunt.registerTask('default', ['bower','wiredep']);
  
  // grunt.registerTask('default', 'Log some stuff.', function() {
  //   grunt.log.write('Logging some stuff...').ok();
  // });
  
};