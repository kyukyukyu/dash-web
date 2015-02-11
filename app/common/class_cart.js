'use strict';

/**
 * @ngdoc service
 * @name dashApp.common.ClassCart
 * @description
 * # ClassCart
 * Factory in the dashApp.common.
 */
angular.module('dashApp.common')
  .factory('ClassCart', function ($rootScope) {
    var _courseGroupsMap = {},
      _courseGroupsList = [];

    return {
      add: function (course) {
        /* jshint camelcase: false */
        var courseGroup;
        if (course.subject_id in _courseGroupsMap) {
          courseGroup = _courseGroupsMap[course.subject_id];
        } else {
          courseGroup = {
            subject: angular.copy(course.subject),
            courses: [],
            required: course.type === 'major'
          };
          _courseGroupsMap[course.subject_id] = courseGroup;
          _courseGroupsList.push(courseGroup);
        }

        for (var i = 0; i < courseGroup.courses.length; ++i) {
          if (courseGroup.courses[i].code === course.code) {
            return;
          }
        }

        courseGroup.courses.push(course);
        $rootScope.$broadcast('addtocart', course);
      },

      getCourseGroups: function () {
        return _courseGroupsList;
      }
    };
  });
