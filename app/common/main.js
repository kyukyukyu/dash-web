'use strict';

/**
 * @ngdoc function
 * @name dashApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashApp
 */
angular.module('dashApp.common')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
