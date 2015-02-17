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
  });
