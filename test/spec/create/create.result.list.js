'use strict';

describe('Controller: CreateResultListCtrl', function () {
  // load the controller's module
  beforeEach(module('dashApp.create'));

  // load module for mocking backend
  beforeEach(module('dashApp.mock.courses'));

  var mock$state,
      $timeout,
      mockCreateSectionState,
      fxCourses,
      CreateResultListCtrl,
      scope;

  // mock services
  beforeEach(module(function ($provide) {
    /* jshint latedef: nofunc */
    $provide.service('$state', $state);
    $provide.factory('CreateSectionState', CreateSectionState);

    function $state() {
      this.go = jasmine.createSpy('$state.go');
    }

    function CreateSectionState(fxCourses) {
      var courses = fxCourses.objects;
      var stateVars = {};
      stateVars.timetable = {};
      stateVars.timetable.fixedCourses = [];
      stateVars.generatedTimetables = [
        {
          credits: 6.00,
          nClassDays: 4,
          nFreeHours: 0.0,
          courses: [courses[2], courses[3]]
        },
        {
          credits: 9.00,
          nClassDays: 4,
          nFreeHours: 5.5,
          courses: [courses[0], courses[2], courses[3]]
        }
      ];
      stateVars.idxTimetable = null;
      return stateVars;
    }
  }));

  // instantiate dependencies
  beforeEach(inject(function (_$state_, _$timeout_, _CreateSectionState_,
                              _fxCourses_) {
    mock$state = _$state_;
    $timeout = _$timeout_;
    mockCreateSectionState = _CreateSectionState_;
    fxCourses = _fxCourses_;
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateResultListCtrl = $controller('CreateResultListCtrl', {
      $scope: scope
    });
  }));

  it('should expose array of generated timetables in state variables for create section to view model', function () {
    expect(CreateResultListCtrl.timetables)
        .toBe(mockCreateSectionState.generatedTimetables);
  });

  it('should expose a function that converts number of free hours to real amount of free time', function () {
    expect(CreateResultListCtrl.getAmountOfFreeTime).not.toBeUndefined();
    expect(CreateResultListCtrl.getAmountOfFreeTime(4)).toEqual(2);
  });

  it('should set the value of state variable for fixed courses with a valid timetable object', function () {
    var courses = fxCourses.objects;
    var tt = {
      credits: 6.00,
      nClassDays: 4,
      nFreeHours: 0.0,
      courses: [courses[2], courses[3]]
    };
    expect(CreateResultListCtrl.setFixedTimetable).not.toBeUndefined();
    CreateResultListCtrl.setFixedTimetable(tt);
    expect(mockCreateSectionState.timetable.fixedCourses).toBe(tt.courses);
  });

  it('should set the value of state variable for fixed courses with null value', function () {
    CreateResultListCtrl.setFixedTimetable(null);
    expect(mockCreateSectionState.timetable.fixedCourses).toEqual([]);
  });

});
