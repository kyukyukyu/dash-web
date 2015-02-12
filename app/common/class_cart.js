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

      remove: function (course) {
        /* jshint camelcase: false */
        if (!(course.subject_id in _courseGroupsMap)) {
          return;
        }
        var courseGroup = _courseGroupsMap[course.subject_id];
        var i;
        for (i = 0; i < courseGroup.courses.length; ++i) {
          if (courseGroup.courses[i].code === course.code) {
            courseGroup.courses.splice(i, 1);
            break;
          }
        }
        if (courseGroup.courses.length === 0) {
          delete _courseGroupsMap[course.subject_id];
          for (i = 0; i < _courseGroupsList.length; ++i) {
            if (_courseGroupsList[i].subject.code === course.subject.code) {
              _courseGroupsList.splice(i, 1);
              break;
            }
          }
        }
        $rootScope.$broadcast('removefromcart', course);
      },

      getCourseGroups: function () {
        return _courseGroupsList;
      }
    };
  });
