(function () {
  'use strict';

  angular.module('dashApp.create')
    .controller('CreateResultDetailsCtrl', CreateResultDetailsCtrl);

  /**
   * @namespace CreateResultDetailsCtrl
   * @description
   * # CreateResultDetailsCtrl
   * Controller for ui-router state `create.result.details`. Provides details
   * for single timetable selected in the list of generated timetables.
   *
   * Here are provided details:
   *
   *     - Credits
   *     - The number of class days
   *     - The amount of free hours
   *     - Subjects and course for each of subjects
   */
  /* @ngInject */
  function CreateResultDetailsCtrl(
      CreateSectionState) {
    var vm = this;
    var generatedTimetables = CreateSectionState.generatedTimetables;
    var idxTimetable = CreateSectionState.idxTimetable;
    _.assign(vm, generatedTimetables[idxTimetable]);
  }
})();
