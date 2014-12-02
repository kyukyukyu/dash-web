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

/**
 * @ngdoc function
 * @name dashApp.controller:ClassSearchCtrl
 * @description
 * # ClassSearchCtrl
 * Controller of the dashApp
 */
angular.module('dashApp')
  .controller('ClassSearchCtrl', function ($scope, Classes, UIBackdrop) {
    $scope.userInput = {
      keyword: '',
      type: null
    };
    $scope.searchResult = null;
    $scope.uiStatus = {
      isSearchBoxFocused: false
    };

    $scope.searchClasses = function () {
      /* jshint camelcase: false */
      var queryObj = {};

      angular.extend(queryObj, parseKeyword($scope.userInput.keyword));

      queryObj.type = $scope.userInput.type;
      if (queryObj.type === 'general') {
        queryObj.area_id = $scope.userInput.area_id;
      } else if (queryObj.type === 'major') {
        queryObj.grade = $scope.userInput.grade;
        queryObj.department_id = $scope.userInput.department_id;
      }

      return Classes.getList(queryObj).then(function (list) {
        var classGroups = {},
            searchResult = [];

        var classGroup;
        angular.forEach(list, function (c) {
          if (!(c.subject_id in classGroups)) {
            classGroups[c.subject_id] = {
              subject: angular.copy(c.subject),
              classes: []
            };
            searchResult.push(classGroups[c.subject_id]);
          }
          classGroup = classGroups[c.subject_id];
          classGroup.classes.push(c);
        });

        $scope.searchResult = searchResult;
      });
    };

    $scope.focusOnSearchBox = function () {
      UIBackdrop.show().then(function () {
        $scope.uiStatus.isSearchBoxFocused = false;
      });
      $scope.uiStatus.isSearchBoxFocused = true;
    };
  });
