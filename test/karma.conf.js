// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-09-11 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of preprocessors
    preprocessors: {
      'app/**/*.tpl.html': ['ng-html2js']
    },

    // list of files / patterns to load in the browser
    files: [
      'node_modules/jasmine-jquery/vendor/jquery/jquery.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/lodash/dist/lodash.compat.js',
      'bower_components/restangular/dist/restangular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/uri.js/src/URI.js',
      'app/common/common.module.js',
      'app/widgets/widgets.module.js',
      'app/create/create.module.js',
      'app/**/*.js',
      'app/**/*.tpl.html',
      'test/mock/**/*.js',
      {
        pattern: 'test/mock/**/*.json',
        watched: true,
        included: false,
        served: true
      },
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'app/'
    },

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
