'use strict';

/**
 * @ngdoc directive
 * @name dashApp.common:dsRepeatDone
 * @description
 * # dsRepeatDone
 *
 * dsRepeatDone checks if ng-repeat loop is done, and evaluate arbitrary expression.
 *
 * Source: http://stackoverflow.com/questions/15207788/calling-a-function-when-ng-repeat-has-finished
 */
angular.module('dashApp.common')
  .directive('dsRepeatDone', function () {

    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          scope.$evalAsync(attr.dsRepeatDone);
        }
      }
    };
  });
