/* jshint latedef: nofunc */
'use strict';

/**
 * @ngdoc function
 * @name dashApp.create.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the create section of dashApp
 */
angular.module('dashApp.create')
  .controller('CreateCtrl', function ($scope, $modal) {
    $scope.timetable = {
      fixedCourses: [],
      previewCourse: null,
      freeHours: []
    };

    $scope.openGenOptions = openGenOptions;

    function openGenOptions() {
      $modal.open({
        templateUrl: 'create/generator_options.tpl.html',
        controller: 'GeneratorOptionsCtrl',
        controllerAs: 'vm',
        windowClass: 'modal-genopt'
      });
    }
  });
