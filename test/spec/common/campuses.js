'use strict';

describe('Service: Campuses', function () {
  /* jshint unused: false */

  // load the service's module
  beforeEach(module('dashApp.common'));

  // load module for mocking backend
  beforeEach(module('dashApp.mock.campuses'));

  // instantiate service
  var $rootScope, $httpBackend, $timeout, Campuses;
  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _$timeout_, _Campuses_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
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

  describe('setting selected campus', function () {
    beforeEach(function () {
      spyOn($rootScope, '$broadcast');
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

    afterEach(function () {
      expect($rootScope.$broadcast).toHaveBeenCalledWith(
        'campusselected',
        Campuses.getSelectedCampus()
      );
    });
  });

});
