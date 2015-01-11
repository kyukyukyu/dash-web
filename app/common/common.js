'use strict';

angular
  .module('dashApp.common', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'restangular',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('campuses', {
        url: '/campuses',
        templateUrl: 'common/campus_list.tpl.html',
        controller: 'CampusListCtrl'
      });
  })
  .config(function (RestangularProvider) {
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
  });
