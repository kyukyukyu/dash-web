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
  function CreateSectionState($state) {
    // State variables object.
    var stateVars = {};
    // String constants that represents UI states.
    /**
     * @name UI_STATE_CONF_COURSE_CART
     * @constant {string}
     * @memberOf Factories.CreateSectionState
     */
    stateVars.UI_STATE_CONF_COURSE_CART = 'create.conf.course-cart';
    /**
     * @name UI_STATE_RESULT_LIST
     * @constant {string}
     * @memberOf Factories.CreateSectionState
     */
    stateVars.UI_STATE_RESULT_LIST = 'create.result.list';
    /**
     * @name UI_STATE_RESULT_DETAILS
     * @constant {string}
     * @memberOf Factories.CreateSectionState
     */
    stateVars.UI_STATE_RESULT_DETAILS = 'create.result.details';
    // UI state stack. Top of stack points to the end of array.
    var uiStateStack = [stateVars.UI_STATE_CONF_COURSE_CART];
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
    /**
     * @function pushUiState
     * @desc Pushes a new UI state to UI state stack, and moves to the state.
     * @param {string} newStateName Name of UI state to push.
     * @memberOf Factories.CreateSectionState
     */
    stateVars.pushUiState = pushUiState;
    /**
     * @function popUiState
     * @desc Pops an UI state from UI state stack, and moves to the state.
     * @memberOf Factories.CreateSectionState
     */
    stateVars.popUiState = popUiState;
    return stateVars;

    function pushUiState(newStateName) {
      uiStateStack.push($state.current.name);
      $state.go(newStateName);
    }

    function popUiState() {
      if (_.isEmpty(uiStateStack)) {
        // This will not happen in normal situation.
        return;
      }
      // Destination UI state.
      var dest = uiStateStack.pop();
      $state.go(dest);
    }
  }
})();
