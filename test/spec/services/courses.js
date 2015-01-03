'use strict';

describe('Service: Courses', function () {
  // load the service's module
  beforeEach(module('dashApp'));

  // instantiate service
  var $httpBackend, Courses;
  beforeEach(inject(function (_$httpBackend_, _Courses_) {
    $httpBackend = _$httpBackend_;
    Courses = _Courses_;
  }));

});
