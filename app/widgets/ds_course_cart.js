'use strict';

/**
 * @ngdoc directive
 * @name dashApp.common:dsCourseCart
 * @description
 * # dsCourseCart
 *
 * dsCourseCart shows what's in the course cart.
 */
angular.module('dashApp.widgets')
  .directive('dsCourseCart', function (CourseCart) {
    /* jshint unused: false */

    function postLink(scope, element, attrs) {
      // This variable will be synced with courseGroups of CourseCart.
      scope.courseGroups = CourseCart.getCourseGroups();
    }

    return {
      templateUrl: 'widgets/ds_course_cart.tpl.html',
      restrict: 'E',
      scope: {},
      link: postLink
    };
  });
