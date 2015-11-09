'use strict';

describe('Service: CreateSectionState', function () {

  // Load the service's module.
  beforeEach(module('dashApp.create'));

  // Instantiate the service.
  var CreateSectionState;
  beforeEach(inject(function (_CreateSectionState_) {
    CreateSectionState = _CreateSectionState_;
  }));

  it('should have state variables initialized', function () {
    expect(CreateSectionState.timetable).toBeDefined();
    expect(CreateSectionState.timetable.fixedCourses).toEqual([]);
    expect(CreateSectionState.timetable.previewCourse).toBeNull();
    expect(CreateSectionState.timetable.freeHours).toEqual([]);
    expect(CreateSectionState.generatedTimetables).toEqual([]);
    expect(CreateSectionState.idxTimetable).toBeNull();
  });

});
