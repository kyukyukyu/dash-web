'use strict';

angular
  .module('dashApp.common', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'restangular',
    'ui.router',
    'dashApp.entity'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('campuses', {
        url: '/campuses',
        templateUrl: 'common/campus_list.tpl.html',
        controller: 'CampusListCtrl'
      });
  });
