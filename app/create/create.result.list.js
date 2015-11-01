(function () {
  'use strict';

  angular.module('dashApp.create')
    .controller('CreateResultListCtrl', CreateResultListCtrl);

  /**
   * @namespace CreateResultListCtrl
   * @description
   * # CreateResultListCtrl
   * Controller for ui-router state `create.result.list`. Provides generated
   * timetables and utility function for displaying stats of tiemtables as view
   * model.
   */
  /* @ngInject */
  function CreateResultListCtrl(
      $state,
      TimetableGenerator) {
    var vm = this;
    vm.timetables = TimetableGenerator.generatedTimetables;
    vm.getAmountOfFreeTime = getAmountOfFreeTime;

    function getAmountOfFreeTime(nFreeHours) {
      // TODO: Provide the amount of single course hour and break time in
      // a service.
      return 0.5 * nFreeHours;
    }
  }
})();
