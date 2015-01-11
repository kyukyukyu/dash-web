'use strict';

angular.module('dashAppE2E', ['dashApp', 'ngMockE2E'])
  .run(function ($httpBackend) {
    $httpBackend.when('GET', /.*\/.*\.tpl\.html/).passThrough();
  });
