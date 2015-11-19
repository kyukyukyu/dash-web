'use strict';

describe('Controller: CreateCtrl', function () {

  // load the controller's module
  beforeEach(module('dashApp.create'));

  // Mock dependency for the controller.
  beforeEach(module(function ($provide) {
    /* jshint latedef: nofunc */
    $provide.factory('CreateSectionState', CreateSectionState);

    function CreateSectionState() {
      return {
        timetable: {
          fixedCourses: [],
          previewCourse: null,
          freeHours: []
        }
      };
    }
  }));

  var MainCtrl,
    scope,
    $modal;
  // Mocked dependencies.
  var mockCreateSectionState;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, CreateSectionState) {
    scope = $rootScope.$new();
    $modal = {
      open: jasmine.createSpy('open')
    };
    mockCreateSectionState = CreateSectionState;
    MainCtrl = $controller('CreateCtrl', {
      $scope: scope,
      $modal: $modal,
      CreateSectionState: CreateSectionState
    });
  }));

  it('should expose timetable state variable to the scope', function () {
    expect(scope.timetable).toBe(mockCreateSectionState.timetable);
  });

  it('should open generator options modal', function () {
    scope.openGenOptions();
    expect($modal.open).toHaveBeenCalled();
  });

});
