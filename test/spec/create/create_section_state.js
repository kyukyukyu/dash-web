'use strict';

describe('Service: CreateSectionState', function () {

  // Load the service's module.
  beforeEach(module('dashApp.create'));

  // Mock dependencies.
  beforeEach(module(function ($provide) {
    /* jshint latedef: nofunc */
    $provide.service('$state', $state);

    function $state() {
      var that = this;
      that.current = {};
      that.current.name = 'create.conf.course-cart';
      that.go = go;
      spyOn(that, 'go').and.callThrough();

      function go(newStateName) {
        that.current.name = newStateName;
      }
    }
  }));

  // Instantiate the service and its dependencies.
  var CreateSectionState;
  var mock$state;
  beforeEach(inject(function (_CreateSectionState_, _$state_) {
    CreateSectionState = _CreateSectionState_;
    mock$state = _$state_;
  }));

  it('should have state variables initialized', function () {
    expect(CreateSectionState.timetable).toBeDefined();
    expect(CreateSectionState.timetable.fixedCourses).toEqual([]);
    expect(CreateSectionState.timetable.previewCourse).toBeNull();
    expect(CreateSectionState.timetable.freeHours).toEqual([]);
    expect(CreateSectionState.generatedTimetables).toEqual([]);
    expect(CreateSectionState.idxTimetable).toBeNull();
  });

  it('should provide function that resets section state', function () {
    CreateSectionState.timetable.fixedCourses.push(42);
    CreateSectionState.timetable.previewCourse = 42;
    CreateSectionState.timetable.freeHours.push(42);
    CreateSectionState.generatedTimetables.push(42);
    CreateSectionState.idxTimetable = 42;
    expect(CreateSectionState.reset).toBeDefined();
    CreateSectionState.reset();
    expect(CreateSectionState.timetable).toBeDefined();
    expect(CreateSectionState.timetable.fixedCourses).toEqual([]);
    expect(CreateSectionState.timetable.previewCourse).toBeNull();
    expect(CreateSectionState.timetable.freeHours).toEqual([]);
    expect(CreateSectionState.generatedTimetables).toEqual([]);
    expect(CreateSectionState.idxTimetable).toBeNull();
  });

  it('should provide functions that pushes/pops a UI state to/from UI state stack', function () {
    expect(CreateSectionState.pushUiState).toBeDefined();
    CreateSectionState.pushUiState('create.result.list');
    expect(mock$state.go).toHaveBeenCalledWith('create.result.list');
    expect(CreateSectionState.popUiState).toBeDefined();
    CreateSectionState.popUiState();
    expect(mock$state.go).toHaveBeenCalledWith('create.conf.course-cart');
  });

});
