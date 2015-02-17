'use strict';

/**
 * @ngdoc function
 * @name dashApp.create.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the create section of dashApp
 */
angular.module('dashApp.create')
  .controller('CreateCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
