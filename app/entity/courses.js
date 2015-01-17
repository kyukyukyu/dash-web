'use strict';

/**
 * @ngdoc service
 * @name dashApp.Courses
 * @description
 * # Courses
 * Factory in the dashApp.
 */
angular.module('dashApp.entity')
  .factory('Courses', function ($q, Restangular, Campuses) {
    var service = {};
    service.REASON_CAMPUS_NOT_SELECTED = 'campus not selected';

    angular.forEach(['get', 'getList'], function (fName) {
      service[fName] = function () {
        var selectedCampus = Campuses.getSelectedCampus();
        if (!selectedCampus) {
          return $q.reject(service.REASON_CAMPUS_NOT_SELECTED);
        }
        return selectedCampus.all('courses')[fName].apply(this, arguments);
      };
    });

    return service;
  });
