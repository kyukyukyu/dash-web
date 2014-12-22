'use strict';

/**
 * @ngdoc overview
 * @name dashApp
 * @description
 * # dashApp
 *
 * Main module of the application.
 */
angular
  .module('dashApp', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'restangular',
    'ui.router',
    'ui.bootstrap',
    'ui.select',
  ])
  .config(function ($stateProvider, $urlRouterProvider, RestangularProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('campuses', {
        url: '/campuses',
        templateUrl: 'views/campus_list.html',
        controller: 'CampusListCtrl'
      });

    RestangularProvider
      .setBaseUrl('/api')
      .addResponseInterceptor(function (data, operation) {
        var extractedData;
        if (operation === 'getList') {
          /* jshint sub: true */
          extractedData = data.objects;
          extractedData.numResults = data['num_results'];
          extractedData.page = data.page;
          extractedData.numPages = data['num_pages'];
        } else {
          extractedData = data;
        }
        return extractedData;
      });
  })
  .config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  });
