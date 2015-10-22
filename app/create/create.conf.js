(function () {
  'use strict';

  /**
   * Parse the keyword into query object.
   * @param {String} keyword Keyword to parse.
   */
  var parseKeyword = function (keyword) {
    if (typeof keyword !== 'string') {
      throw new TypeError('keyword should be string');
    }

    var queryObj = {};
    var arr = keyword.split(/\b(name|instructor|subject):/);

    for (var i = 0, str; i < arr.length; ++i) {
      var key, value;

      str = arr[i];

      if (/^(name|instructor|subject)$/.test(str)) {
        // get the value for specified property
        value = arr[++i];
        switch (str) {
          case 'name':
                key = 'name';
                break;
          case 'instructor':
                key = 'instructor';
                break;
          case 'subject':
                key = 'subject';
        }
      } else {
        key = 'name';
        value = str;
      }

      value = value.trim();
      if (!value) {
        continue;
      }
      queryObj[key] = value.trim();
    }

    return queryObj;
  };

  angular.module('dashApp.create')
    .controller('CreateConfCtrl', CreateConfCtrl);

  /**
   * @namespace CreateConfCtrl
   * @description
   * # CreateConfCtrl
   * Controller for ui-router abstract state `create.conf`. Manages status of
   * user interface for configuring timetables to be generated.
   */
  /* @ngInject */
  function CreateConfCtrl(
      $q,
      $scope,
      $state,
      Restangular,
      Courses,
      TimetableGenerator,
      UIBackdrop) {
    $scope.userInput = {
      keyword: '',
      type: null
    };
    $scope.departments = Restangular.all('departments').getList().$object;
    $scope.categories = Restangular.all('gen_edu_categories').getList().$object;
    $scope.searchResult = null;
    $scope.uiStatus = {
      isSearchBoxFocused: false,
      isOptionBoxOpen: true,
      isResultBoxOpen: false,
      generating: false
    };

    $scope.$watch('userInput.type', function (type) {
      /* jshint camelcase: false */
      if (type === 'general') {
        $scope.userInput.category_id = $scope.userInput.category_id || null;
      } else if (type === 'major') {
        $scope.userInput.target_grade = $scope.userInput.target_grade || null;
        $scope.userInput.department_id = $scope.userInput.department_id || null;
      }
    });

    $scope.searchCourses = function () {
      /* jshint camelcase: false */
      var queryObj = {};

      angular.extend(queryObj, parseKeyword($scope.userInput.keyword));

      queryObj.type = $scope.userInput.type;
      if (queryObj.type === 'general') {
        queryObj.category_id = $scope.userInput.category_id;
      } else if (queryObj.type === 'major') {
        queryObj.target_grade = $scope.userInput.target_grade;
        queryObj.department_id = $scope.userInput.department_id;
      }

      return Courses.getList(queryObj).then(function (list) {
        var courseGroups = {},
            searchResult = [];

        var courseGroup;
        angular.forEach(list, function (c) {
          if (!(c.subject_id in courseGroups)) {
            courseGroups[c.subject_id] = {
              subject: angular.copy(c.subject),
              courses: []
            };
            searchResult.push(courseGroups[c.subject_id]);
          }
          courseGroup = courseGroups[c.subject_id];
          courseGroup.courses.push(c);
        });

        $scope.searchResult = searchResult;
        $scope.uiStatus.isResultBoxOpen = true;
        $state.go('^.search-result');
      }, function (reason) {
        if (reason === Courses.REASON_CAMPUS_NOT_SELECTED) {
          // TODO: Warn the user that there is no selected campus.
          //       A service for alert should be implemented.
          return $q.reject('campus not selected');
        }
        return $q.reject(reason);
      });
    };

    $scope.focusOnSearchBox = function () {
      UIBackdrop.show().then(function () {
        $scope.uiStatus.isSearchBoxFocused = false;
        $state.go('^.course-cart');
      });
      $scope.uiStatus.isSearchBoxFocused = true;
      $state.go('^.search');
    };

    $scope.generateTimetables = generateTimetables;

    /**
     * @name generateTimetables
     * @desc Generates timetables with courses in course carts and timetable
     * generator options.
     * @memberof CreateConfCtrl
     */
    function generateTimetables() {
      $scope.uiStatus.generating = true;
      TimetableGenerator.generate().then(function (timetables) {
        $state.go('^.^.result.list', timetables);
      });
    }
  }
})();
