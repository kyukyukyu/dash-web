'use strict';

/**
 * @ngdoc service
 * @name dashApp.Campuses
 * @description
 * # Campuses
 * Factory in the dashApp.
 */
angular.module('dashApp')
  .factory('Campuses', function (Restangular) {
    return Restangular.service('campuses');
  });
