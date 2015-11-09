(function () {
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
    .controller('CreateCtrl', CreateCtrl);

  /* @ngInject */
  function CreateCtrl($scope, $modal, CreateSectionState) {
    $scope.timetable = CreateSectionState.timetable;

    $scope.openGenOptions = openGenOptions;

    function openGenOptions() {
      $modal.open({
        templateUrl: 'create/generator_options.tpl.html',
        controller: 'GeneratorOptionsCtrl',
        controllerAs: 'vm',
        windowClass: 'modal-genopt'
      });
    }
  }
})();
