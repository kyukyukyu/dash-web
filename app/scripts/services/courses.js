'use strict';

/**
 * @ngdoc service
 * @name dashApp.Courses
 * @description
 * # Courses
 * Factory in the dashApp.
 */
angular.module('dashApp')
  .factory('Courses', function (Restangular) {
    return Restangular.service('courses');
  });
