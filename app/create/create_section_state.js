/**
 * Factory for managing state variables for create section.
 * @namespace Factories
 */
(function () {
  'use strict';

  angular.module('dashApp.create')
    .factory('CreateSectionState', CreateSectionState);

  /**
   * @namespace CreateSectionState
   * @desc State variables manager for create section.
   * @memberOf Factories
   */
  /* @ngInject */
  function CreateSectionState() {
    var stateVars = {};
    /**
     * @name timetable
     * @desc Timetable object for `<ds-timetable>` object in the left column.
     *       There are three properties in here: `fixedCourses`,
     *       `previewCourse`, and `freeHours`.
     *
     *       `fixedCourses` is for the list of fixed courses which are
     *       considered to be *fixed* in the timetable. `previewCourse` is for
     *       the course which is considered to be for *preview*. `freeHours` is
     *       for the list of pairs that represents free hours.
     * @type {{fixedCourses: Array<Object>, previewCourse: ?Object, freeHours: Array< Array<number> >}}
     * @memberOf Factories.CreateSectionState
     */
    stateVars.timetable = {
      fixedCourses: [],
      previewCourse: null,
      freeHours: []
    };
    /**
     * @name generatedTimetables
     * @desc List of generated timetable objects by `TimetableGenerator`.
     * @type {Array<Object>}
     * @memberOf Factories.CreateSectionState
     */
    stateVars.generatedTimetables = [];
    /**
     * @name idxTimetable
     * @desc Index of selected timetable to see details of in `idxTimetable`.
     *       `null` if none of them is selected.
     * @type {?number}
     * @memberOf Factories.CreateSectionState
     */
    stateVars.idxTimetable = null;
    return stateVars;
  }
})();
