/* global getJSONFixture */
'use strict';

describe('Service: Courses', function () {
  /* jshint unused: false */
  jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';

  var fxCourses = getJSONFixture('courses.json');

  // load the service's module
  beforeEach(module('dashApp'));

  // instantiate service
  var $httpBackend, Courses;
  beforeEach(inject(function (_$httpBackend_, _Courses_) {
    $httpBackend = _$httpBackend_;
    Courses = _Courses_;
  }));

});
