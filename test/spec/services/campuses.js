/* global getJSONFixture */

'use strict';

describe('Service: Campuses', function () {
  /* jshint unused: false */
  jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';

  var mockCampuses = getJSONFixture('campuses.json');

  // load the service's module
  beforeEach(module('dashApp'));

  // instantiate service
  var $httpBackend, $timeout, Campuses;
  beforeEach(inject(function (_$httpBackend_, _$timeout_, _Campuses_) {
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    $httpBackend.when('GET', '/api/campuses').respond(mockCampuses);
    $httpBackend.when('GET', '/api/campuses/1').respond(mockCampuses.objects[0]);
    Campuses = _Campuses_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should get the list of campuses', function () {
    $httpBackend.expect('GET', '/api/campuses');
    var campusList = Campuses.getList().$object;
    $httpBackend.flush();

    expect(campusList.length).toBe(2);

    var campus;
    campus = campusList[0];
    expect(campus.id).toBe(1);
    expect(campus.name).toBe('HYU Seoul');
    campus = campusList[1];
    expect(campus.id).toBe(2);
    expect(campus.name).toBe('HYU ERICA');
  });

  it('should get single campus', function () {
    $httpBackend.expect('GET', '/api/campuses/1');
    var campus = Campuses.one(1).get().$object;
    $httpBackend.flush();

    expect(campus.id).toBe(1);
    expect(campus.name).toBe('HYU Seoul');
  });

  it('should set an campus object as selected campus for the app', function () {
    $httpBackend.expect('GET', '/api/campuses/1');
    var campus = Campuses.one(1).get().$object;
    $httpBackend.flush();

    Campuses.setSelectedCampus(campus);
    $timeout.flush();

    var selectedCampus = Campuses.getSelectedCampus();
    expect(selectedCampus.id).toBe(1);
    expect(selectedCampus.name).toBe('HYU Seoul');
  });

  it('should set selected campus for the app with its id', function () {
    $httpBackend.expect('GET', '/api/campuses/1');
    Campuses.setSelectedCampus(1);
    $httpBackend.flush();
    $timeout.flush();

    var selectedCampus = Campuses.getSelectedCampus();
    expect(selectedCampus.id).toBe(1);
    expect(selectedCampus.name).toBe('HYU Seoul');
  });

});
