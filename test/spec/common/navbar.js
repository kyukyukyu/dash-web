'use strict';

describe('Controller: NavbarCtrl', function () {

  // load the controller's module
  beforeEach(module('dashApp.common'));

  // load module for mocking backend
  beforeEach(module('dashApp.mock.campuses'));

  var NavbarCtrl,
    scope;
  var $httpBackend,
    $timeout,
    fxCampuses;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_,
                              _$timeout_, _fxCampuses_) {
    scope = $rootScope.$new();
    NavbarCtrl = $controller('NavbarCtrl', {
      $scope: scope
    });
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    fxCampuses = _fxCampuses_;
  }));

  beforeEach(function () {
    $httpBackend.expect('GET', '/api/campuses');
    $httpBackend.flush();
    $timeout.flush();
  });

  it('should load the list of campuses and attach it to the scope', function () {
    expect(scope.campuses.plain()).toEqual(fxCampuses.objects);
  });

  it('should set the selected campus', function () {
    scope.setSelectedCampus(scope.campuses[1]);
    $timeout.flush();
    expect(scope.selectedCampus).toEqual(scope.campuses[1]);
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});
