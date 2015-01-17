'use strict';

/**
 * @ngdoc function
 * @name dashApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the dashApp
 */
angular.module('dashApp.common')
  .controller('NavbarCtrl', function ($scope, Campuses) {
    $scope.campuses = Campuses.getList().$object;
    $scope.selectedCampus = null;
    $scope.$on('campusselected', function (event, selectedCampus) {
      $scope.selectedCampus = selectedCampus;
    });
    $scope.setSelectedCampus = Campuses.setSelectedCampus;
  });
