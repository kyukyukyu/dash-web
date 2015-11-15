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
      CreateSectionState) {
    var vm = this;
    vm.timetables = CreateSectionState.generatedTimetables;
    vm.getAmountOfFreeTime = getAmountOfFreeTime;
    vm.setFixedTimetable = setFixedTimetable;

    function getAmountOfFreeTime(nFreeHours) {
      // TODO: Provide the amount of single course hour and break time in
      // a service.
      return 0.5 * nFreeHours;
    }

    function setFixedTimetable(tt) {
      var fixedCourses;
      if (_.isNull(tt)) {
        fixedCourses = [];
      } else {
        fixedCourses = tt.courses;
      }
      CreateSectionState.timetable.fixedCourses = fixedCourses;
    }
  }
})();
