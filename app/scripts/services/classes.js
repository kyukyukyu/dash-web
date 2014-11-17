'use strict';

/**
 * @ngdoc service
 * @name dashApp.Classes
 * @description
 * # Classes
 * Factory in the dashApp.
 */
angular.module('dashApp')
  .factory('Classes', function (Restangular) {
    return Restangular.service('classes');
  });
