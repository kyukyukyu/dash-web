'use strict';

angular.module('dashApp.mock.common', ['ngMock'])
  .config(function () {
    jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';
  });
