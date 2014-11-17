/* global getJSONFixture */
'use strict';

describe('Service: Classes', function () {
  /* jshint unused: false */
  jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';

  var fxClasses = getJSONFixture('classes.json');

  // load the service's module
  beforeEach(module('dashApp'));

  // instantiate service
  var $httpBackend, Classes;
  beforeEach(inject(function (_$httpBackend_, _Classes_) {
    $httpBackend = _$httpBackend_;
    Classes = _Classes_;
  }));

});
