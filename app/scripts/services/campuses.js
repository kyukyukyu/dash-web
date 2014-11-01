'use strict';

/**
 * @ngdoc service
 * @name dashApp.Campuses
 * @description
 * # Campuses
 * Factory in the dashApp.
 */
angular.module('dashApp')
  .factory('Campuses', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
