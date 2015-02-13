'use strict';

/**
 * @ngdoc service
 * @name dashApp.common.CourseCart
 * @description
 * # CourseCart
 * Factory in the dashApp.common.
 */
angular.module('dashApp.common')
  .factory('CourseCart', function ($rootScope) {
    var _courseGroupsMap = {},
      _courseGroupsList = [];

    function _contains(subjectId) {
      return subjectId in _courseGroupsMap;
    }

    $rootScope.$on('campusselected', function () {
      if (_courseGroupsList.length === 0) {
        return;
      }
      _courseGroupsMap = {};
      _courseGroupsList = [];
      $rootScope.$broadcast('clearcart');
    });

    return {
      add: function (course) {
        /* jshint camelcase: false */
        var courseGroup;
        if (_contains(course.subject_id)) {
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
        $rootScope.$broadcast('addtocart', course, courseGroup);
      },

      remove: function (course) {
        /* jshint camelcase: false */
        if (!_contains(course.subject_id)) {
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

      setCourseGroupRequired: function (subjectId, required) {
        if (!_contains(subjectId)) {
          return;
        }
        if (_courseGroupsMap[subjectId].required === required) {
          return;
        }
        _courseGroupsMap[subjectId].required = required;
        $rootScope.$broadcast('changerequiredincart', subjectId, required);
      },

      getCourseGroups: function () {
        return _courseGroupsList;
      },

      getCourseGroup: function (subjectId) {
        if (!_contains(subjectId)) {
          throw 'no course group found';
        }
        return _courseGroupsMap[subjectId];
      }
    };
  });
