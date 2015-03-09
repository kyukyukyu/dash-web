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
        _(courseGroups).find(function (courseGroup) {
          if (courseGroup.subject.id === subjectId) {
            courseGroup.required = !!required;
            return true;
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
      var timetables;

      TimetableGenerator.generate().then(function (_timetables) {
        timetables = _timetables;
      });

      $timeout.flush();

      sort(timetables);
      expect(timetables.length).toBe(1);
      expect(timetables[0]).toContainCoursesWithId([2, 3, 4, 5]);
    });

    function sort(timetables) {
      timetables.sort(function (a, b) {
        var coursesA = a.courses;
        var coursesB = b.courses;

        if (coursesA.length !== coursesB.length) {
          return coursesA.length - coursesB.length;
        }

        var arrOfcourseIds = _([coursesA, coursesB])
          .map(function (courses) {
            return _(courses).pluck('id').sort();
          });
        var courseIdPairs = _.zip.apply(null, arrOfcourseIds);
        var index = _.find(courseIdPairs, function (pair) {
          return pair[0] !== pair[1];
        });

        if (_.isUndefined(index)) {
          return 0;
        } else {
          var pair = courseIdPairs[index];
          return pair[0] - pair[1];
        }
      });
    }

  });
})();
