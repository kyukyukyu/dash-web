/* global getJSONFixture */

'use strict';

describe('Service: Campuses', function () {
  /* jshint unused: false */
  jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';

  var mockCampuses = getJSONFixture('campuses.json');

  // load the service's module
  beforeEach(module('dashApp'));

  // instantiate service
  var $httpBackend, Campuses;
  beforeEach(inject(function (_$httpBackend_, _Campuses_) {
    $httpBackend = _$httpBackend_;
    Campuses = _Campuses_;
  }));

});
