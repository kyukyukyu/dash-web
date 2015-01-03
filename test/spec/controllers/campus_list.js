'use strict';

describe('Controller: CampusListCtrl', function () {
  // load the controller's module
  beforeEach(module('dashApp'));

  // load module for mocking backend
  beforeEach(module('dashApp.mock.campuses'));

  var $httpBackend, createController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;

    scope = $rootScope.$new();
    createController = function () {
      return $controller('CampusListCtrl', {
        $scope: scope
      });
    };
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should load the list of campuses to the scope', function () {
    /* jshint unused: false */

    $httpBackend.expect('GET', '/api/campuses');
    var controller = createController();
    $httpBackend.flush();

    expect(scope.campuses.length).toBe(2);

    var seoul = scope.campuses[0];
    expect(seoul.id).toBe(1);
    expect(seoul.name).toBe('HYU Seoul');

    var erica = scope.campuses[1];
    expect(erica.id).toBe(2);
    expect(erica.name).toBe('HYU ERICA');
  });
});
