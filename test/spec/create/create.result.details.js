'use strict';

describe('Controller: CreateResultDetailsCtrl', function () {
  // Load the controller's module.
  beforeEach(module('dashApp.create'));

  // Load module for test fixtures.
  beforeEach(module('dashApp.mock.courses'));

  // Test fixtures.
  var fxCourses;
  // Dependencies for the controller.
  var mockCreateSectionState;
  // Controller instance.
  var CreateResultDetailsCtrl;

  // Mock dependencies for the controller.
  beforeEach(module(function ($provide) {
    /* jshint latedef: nofunc */
    $provide.factory('CreateSectionState', CreateSectionState);

    function CreateSectionState(fxCourses) {
      var courses = fxCourses.objects;
      var stateVars = {};
      stateVars.generatedTimetables = [
        {
          credits: 6.00,
          nClassDays: 4,
          nFreeHours: 0,
          courses: [courses[2], courses[3]]
        },
        {
          credits: 9.00,
          nClassDays: 4,
          nFreeHours: 5.5,
          courses: [courses[0], courses[2], courses[3]]
        }
      ];
      stateVars.idxTimetable = 0;
      return stateVars;
    }
  }));

  // Instantiate dependencies.
  beforeEach(inject(function (_fxCourses_, _CreateSectionState_) {
    fxCourses = _fxCourses_;
    mockCreateSectionState = _CreateSectionState_;
  }));

  // Instantiate the controller with mock scope.
  beforeEach(inject(function ($controller, $rootScope) {
    CreateResultDetailsCtrl = $controller('CreateResultDetailsCtrl', {
      $scope: $rootScope.$new(),
      CreateSectionState: mockCreateSectionState
    });
  }));

  it('should expose timetable data to view model', function () {
    var courses = fxCourses.objects;
    expect(CreateResultDetailsCtrl.credits).toEqual(6.00);
    expect(CreateResultDetailsCtrl.nClassDays).toEqual(4);
    expect(CreateResultDetailsCtrl.nFreeHours).toEqual(0);
    expect(CreateResultDetailsCtrl.courses).toEqual([courses[2], courses[3]]);
  });

});
