'use strict';

angular.module('dashApp.mock.common', [])
  .config(function () {
    jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';
  });
