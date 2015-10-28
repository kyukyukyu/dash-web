(function () {
  'use strict';

  angular.module('dashApp.create')
    .controller('CreateResultCtrl', CreateResultCtrl);

  /**
   * @namespace CreateResultCtrl
   * @description
   * # CreateResultCtrl
   * Controller for ui-router abstract state `create.result`. Manages status of
   * user interface for showing the list of generated timetables and details of
   * single timetable.
   */
  /* @ngInject */
  function CreateResultCtrl(
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
