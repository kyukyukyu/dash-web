(function() {
  /* jshint latedef: nofunc */
  'use strict';

  describe('Service: TimetableGenerator', function () {

    // load the service's module
    beforeEach(module('dashApp.create'));

    // load mock modules
    beforeEach(module('dashApp.mock.campuses'));
    beforeEach(module('dashApp.mock.courses'));

    // instantiate fixtures
    var fxCourses,
      mockCourses;
    beforeEach(function () {
      fxCourses = getJSONFixture('courses.json');
      mockCourses = fxCourses.objects;
    });

    // mock CourseCart
    var CourseCart;
    beforeEach(function () {
      var courseGroups = [
        {
          required: true,
          subject: mockCourses[0].subject,
          courses: [
            mockCourses[0],
            mockCourses[1]
          ]
        },
        {
          required: true,
          subject: mockCourses[2].subject,
          courses: [
            mockCourses[2]
          ]
        },
        {
          required: true,
          subject: mockCourses[3].subject,
          courses: [
            mockCourses[3]
          ]
        },
        {
          required: true,
          subject: mockCourses[4].subject,
          courses: [
            mockCourses[4]
          ]
        }
      ];
      CourseCart = {};
      CourseCart.getCourseGroups = getCourseGroups;
      CourseCart.setCourseGroupRequired = setCourseGroupRequired;

      module(function ($provide) {
        $provide.value('CourseCart', CourseCart);
      });

      function getCourseGroups() {
        return courseGroups;
      }

      function setCourseGroupRequired(subjectId, required) {
        _(courseGroups).forEach(function (courseGroup) {
          if (courseGroup.subject.id === subjectId) {
            courseGroup.required = !!required;
            return false;
          }
        });
      }
    });

    // instantiate dependencies
    var $rootScope,
      $httpBackend,
      $timeout;
    beforeEach(inject(function (_$rootScope_,
                                _$httpBackend_,
                                _$timeout_) {
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      $timeout = _$timeout_;
    }));

    // instantiate service
    var TimetableGenerator;
    beforeEach(inject(function (_TimetableGenerator_) {
      TimetableGenerator = _TimetableGenerator_;
    }));

    // make sure there is no outstanding http expectation/request
    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    // add custom matcher
    var customMatchers = {
      toContainCoursesWithId: function (util, customEqualityTesters) {
        var ret = {};
        ret.compare = compare;
        return ret;

        function compare(actual, expected) {
          var courseIds = _(actual.courses).pluck('id').sort();
          return { pass: util.equals(courseIds.value(), expected, customEqualityTesters) };
        }
      }
    };
    beforeEach(function () {
      jasmine.addMatchers(customMatchers);
    });

    it('should generate possible timetables with required course groups', function () {
      var expected = [
        [2, 3, 4, 5]
      ];
      testTimetables(expected);
    });

    it('should generate possible timetables with optional course groups', function () {
      var courseGroups = CourseCart.getCourseGroups();
      _(courseGroups).forEach(function (courseGroup) {
        var subject = courseGroup.subject;
        CourseCart.setCourseGroupRequired(subject.id, false);
      });

      var expected = [
        [1], [2], [3], [4], [5],  // 5
        [1, 3], [1, 4], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5],   // 8
        [1, 3, 4], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5],  // 5
        [2, 3, 4, 5]  // 1
      ];
      testTimetables(expected);
    });

    it('should generate possible timetables with required course groups and optional ones mixed', function () {
      var courseGroups = CourseCart.getCourseGroups();
      _(courseGroups).at(0, 3).forEach(function (courseGroup) {
        var subject = courseGroup.subject;
        CourseCart.setCourseGroupRequired(subject.id, false);
      });

      var expected = [
        [3, 4],   // 1
        [1, 3, 4], [2, 3, 4], [3, 4, 5],    // 3
        [2, 3, 4, 5]  // 1
      ];
      testTimetables(expected);
    });

    describe('interface for options', function () {

      it('should have default options object with null values', function () {
        var options = TimetableGenerator.getOptions();
        expect(options.minCredits).toBeNull();
        expect(options.maxCredits).toBeNull();
        expect(options.minDailyClassCount).toBeNull();
        expect(options.maxDailyClassCount).toBeNull();
        expect(options.minWeeklyClassCount).toBeNull();
        expect(options.maxWeeklyClassCount).toBeNull();
      });

      it('should be able to set options correctly', function () {
        var options;

        TimetableGenerator.setOption('minCredits', 10);
        options = TimetableGenerator.getOptions();
        expect(options.minCredits).toBe(10);

        TimetableGenerator.setOption('maxCredits', 8);
        options = TimetableGenerator.getOptions();
        expect(options.maxCredits).toBeNull();

        TimetableGenerator.setOption('maxCredits', 20);
        options = TimetableGenerator.getOptions();
        expect(options.maxCredits).toBe(20);

        TimetableGenerator.setOption('minCredits', 30);
        options = TimetableGenerator.getOptions();
        expect(options.minCredits).toBe(10);


        TimetableGenerator.setOption('minDailyClassCount', 2);
        options = TimetableGenerator.getOptions();
        expect(options.minDailyClassCount).toBe(2);

        TimetableGenerator.setOption('maxDailyClassCount', 1);
        options = TimetableGenerator.getOptions();
        expect(options.maxDailyClassCount).toBeNull();

        TimetableGenerator.setOption('maxDailyClassCount', 4);
        options = TimetableGenerator.getOptions();
        expect(options.maxDailyClassCount).toBe(4);

        TimetableGenerator.setOption('minDailyClassCount', 5);
        options = TimetableGenerator.getOptions();
        expect(options.minDailyClassCount).toBe(2);


        TimetableGenerator.setOption('minWeeklyClassCount', 3);
        options = TimetableGenerator.getOptions();
        expect(options.minWeeklyClassCount).toBe(3);

        TimetableGenerator.setOption('maxWeeklyClassCount', 2);
        options = TimetableGenerator.getOptions();
        expect(options.maxWeeklyClassCount).toBeNull();

        TimetableGenerator.setOption('maxWeeklyClassCount', 4);
        options = TimetableGenerator.getOptions();
        expect(options.maxWeeklyClassCount).toBe(4);

        TimetableGenerator.setOption('maxWeeklyClassCount', 8);
        options = TimetableGenerator.getOptions();
        expect(options.maxWeeklyClassCount).toBe(4);

        TimetableGenerator.setOption('minWeeklyClassCount', 5);
        options = TimetableGenerator.getOptions();
        expect(options.minWeeklyClassCount).toBe(3);
      });

    });

    function testTimetables(expected) {
      var timetables;

      TimetableGenerator.generate().then(function (_timetables) {
        timetables = _timetables;
      });

      $timeout.flush();

      sort(timetables);

      expect(timetables.length).toBe(expected.length);
      _(expected).forEach(function (courseIds, ttIndex) {
        expect(timetables[ttIndex]).toContainCoursesWithId(courseIds);
      });
    }

    function sort(timetables) {
      timetables.sort(function (a, b) {
        var coursesA = a.courses;
        var coursesB = b.courses;

        if (coursesA.length !== coursesB.length) {
          return coursesA.length - coursesB.length;
        }

        var arrOfcourseIds = _([coursesA, coursesB])
          .map(function (courses) {
            return _(courses).pluck('id').sort().value();
          });
        var courseIdPairs = _.zip.apply(null, arrOfcourseIds.value());
        var nonEqualPair = _.find(courseIdPairs, function (pair) {
          return pair[0] !== pair[1];
        });

        if (_.isUndefined(nonEqualPair)) {
          return 0;
        } else {
          return nonEqualPair[0] - nonEqualPair[1];
        }
      });
    }

  });
})();
