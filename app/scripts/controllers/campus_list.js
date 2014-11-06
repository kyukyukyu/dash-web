'use strict';

/**
 * @ngdoc function
 * @name dashApp.controller:CampusListCtrl
 * @description
 * # CampusListCtrl
 * Controller of the dashApp
 */
angular.module('dashApp')
  .controller('CampusListCtrl', function ($scope, Campuses) {
    $scope.campuses = Campuses.getList().$object;
  });
