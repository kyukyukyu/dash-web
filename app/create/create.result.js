(function () {
  'use strict';

  angular.module('dashApp.create')
    .controller('CreateResultCtrl', CreateResultCtrl);

  /**
   * @namespace CreateResultCtrl
   * @description
   * # CreateResultCtrl
   * Controller for ui-router abstract state `create.result`. Manages
   * navigation UI between the list of generated timetables and details of
   * single timetable.
   */
  /* @ngInject */
  function CreateResultCtrl($state, $scope, CreateSectionState) {
    // String constants for title in navigation bar.
    var TITLE_LIST = 'Generated Timetables';
    var TITLE_DETAILS = 'Details';
    var vm = this;
    vm.title = TITLE_LIST;
    vm.usingRightBtn = false;
    vm.rightBtnIconClass = null;
    vm.popUiState = CreateSectionState.popUiState;

    // Update view model correctly on each of UI state transitions.
    var deregFunc = $scope.$on('$stateChangeStart', onStateChangeStart);
    $scope.$on('$destroy', function () { deregFunc(); });

    function onStateChangeStart(e, toState) {
      var toStateName = toState.name;
      if (CreateSectionState.UI_STATE_RESULT_DETAILS === toStateName) {
        vm.title = TITLE_DETAILS;
        vm.usingRightBtn = true;
        vm.rightBtnIconClass = null;
      } else if (CreateSectionState.UI_STATE_RESULT_LIST === toStateName) {
        vm.title = TITLE_LIST;
        vm.usingRightBtn = false;
        vm.rightBtnIconClass = null;
      }
    }
  }
})();
