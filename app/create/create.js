'use strict';

/**
 * @ngdoc overview
 * @name dashApp.create
 * @description
 * # dashApp.create
 *
 * Module for creating timetables.
 */
angular
  .module('dashApp.create', [
    'ngAnimate',
    'ui.bootstrap',
    'dashApp.common'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('create', {
        url: '/',
        templateUrl: 'create/create.tpl.html',
        controller: 'MainCtrl'
      });
  });
