(function () {
  /* jshint latedef: nofunc */
  'use strict';

  /**
   * @ngdoc service
   * @name dashApp.create:TimetableGenerator
   * @description
   * # TimetableGenerator
   *
   * TimetableGenerator looks up the course cart, and generate possible
   * timetables.
   */
  angular.module('dashApp.create')
    .factory('TimetableGenerator', TimetableGenerator);

  /* @ngInject */
  function TimetableGenerator($timeout, $q, CourseCart) {
    var service = {
      generate: generate,
      getOptions: getOptions,
      setOption: setOption,
      generatedTimetables: []
    };

    var options = {
      minCredits: null,
      maxCredits: null,
      minDailyClassCount: null,
      maxDailyClassCount: null,
      minWeeklyClassCount: null,
      maxWeeklyClassCount: null
    };

    return service;

    function generate() {
      var deferred = $q.defer();

      $timeout(function () {
        var timetables = _generate();
        service.generatedTimetables = timetables;
        deferred.resolve(timetables);
      }, 0);

      return deferred.promise;
    }

    function _generate() {
      var courseGroups = CourseCart.getCourseGroups();
      var courses = _.flatten(courseGroups, true, 'courses');
      var cm = new ConflictManager(courses);
      var cIndexList = [];
      var cgIndexA = 0;

      var n = courseGroups.length;
      while (n--) {
        cIndexList.push(-1);
      }

      function mapFunc(cIndex, cgIndex) {
        var ret;

        --cIndex;
        if (cIndex < 0) {
          ret = null;
        } else {
          ret = courseGroups[cgIndex].courses[cIndex];
        }

        return ret;
      }

      function adder(sum, a) {
        return sum + a;
      }

      function accFreeHours(acc, classHours) {
        classHours = _(classHours).sortBy('start_time');
        var chPairs =
            _.zip(_(classHours).initial(1).value(),
                  _(classHours).rest(1).value());
        var nDailyFreeHours = chPairs.reduce(accDailyFreeHours, 0);
        return acc + nDailyFreeHours;

        ////////

        function accDailyFreeHours(accDaily, chPair) {
          /* jshint camelcase: false */
          return accDaily + (chPair[1].start_time - chPair[0].end_time - 1);
        }
      }

      var timetables = [];
      while (cgIndexA >= 0) {
        if (cgIndexA === courseGroups.length) {
          // all the course groups were used, so generate timetable
          var ttCourses =
              _(cIndexList)
                .map(mapFunc)
                .compact();
          var isValid = true;

          isValid = isValid && ttCourses.size() > 0;

          var credits =
              ttCourses
                .pluck('subject')
                .pluck('credits')
                .reduce(adder, 0);
          isValid = isValid &&
              (_.isNull(options.minCredits) ||
               credits >= options.minCredits) &&
              (_.isNull(options.maxCredits) ||
               credits <= options.maxCredits);

          var classHoursByDay =
              ttCourses
                .pluck('hours')
                .flatten(true)
                .groupBy('day_of_week');
          var classCounts =
              classHoursByDay
                .map(_.size);
          var nFreeHours =
              classHoursByDay
                .reduce(accFreeHours, 0);

          var minDailyClassCount = classCounts.min().value();
          var maxDailyClassCount = classCounts.max().value();
          isValid = isValid &&
              (_.isNull(options.minDailyClassCount) ||
               minDailyClassCount >= options.minDailyClassCount) &&
              (_.isNull(options.maxDailyClassCount) ||
               maxDailyClassCount <= options.maxDailyClassCount);

          var weeklyClassCount = classCounts.size();
          isValid = isValid &&
              (_.isNull(options.minWeeklyClassCount) ||
               weeklyClassCount >= options.minWeeklyClassCount) &&
              (_.isNull(options.maxWeeklyClassCount) ||
               weeklyClassCount <= options.maxWeeklyClassCount);

          if (isValid) {
            var timetable = {
              courses: ttCourses.value(),
              credits: credits,
              nClassDays: weeklyClassCount,
              nFreeHours: nFreeHours
            };
            timetables.push(timetable);
          }
          cIndexList[cgIndexA] = -1;
          --cgIndexA;
          continue;
        }

        var courseGroupA = courseGroups[cgIndexA];
        var coursesA = courseGroupA.courses;
        var cIndexA;    // 0 means that no course was selected in course group

        if (cIndexList[cgIndexA] === -1) {
          // the first course in course group #(cgIndexA) will be added to
          // timetable this time
          cIndexA = courseGroupA.required ? 1 : 0;
        } else {
          cIndexA = cIndexList[cgIndexA] + 1;
        }

        if (cIndexA === coursesA.length + 1) {
          // course group #(cgIndexA) are exhausted
          cIndexList[cgIndexA] = -1;
          --cgIndexA;
          continue;
        }

        cIndexList[cgIndexA] = cIndexA;

        // use (dirty) for-statement to avoid creating functions in loop
        var conflicts = false;
        if (cIndexA > 0) {
          for (var cgIndexB = 0; cgIndexB < cgIndexA; ++cgIndexB) {
            var cIndexB = cIndexList[cgIndexB];
            if (cIndexB === 0) {
              continue;
            }

            var courseGroupB = courseGroups[cgIndexB];
            var coursesB = courseGroupB.courses;
            conflicts = cm.checkConflict(coursesA[cIndexA - 1].id,
              coursesB[cIndexB - 1].id);
            if (conflicts) {
              break;
            }
          }
        }
        if (conflicts) {
          // conflict detected: cannot add more courses from later course
          // groups
          continue;
        }
        ++cgIndexA;
      }

      return timetables;
    }

    function getOptions() {
      return options;
    }

    function setOption(name, value) {
      var prefix = name.substr(0, 3);
      var suffix = name.substr(3);
      var minBound = 0;
      var maxBound;

      if (suffix === 'WeeklyClassCount') {
        minBound = 1;
        maxBound = 7;
      }

      var isValid = false;
      var oppositePrefix = (prefix === 'min') ? 'max' : 'min';
      var counterPart = options[oppositePrefix + suffix];
      if (prefix === 'min') {
        isValid = (_.isUndefined(minBound) || value >= minBound) &&
            (_.isNull(counterPart) || value <= counterPart);
      } else {
        isValid = (_.isUndefined(maxBound) || value <= maxBound) &&
            (_.isNull(counterPart) || value >= counterPart);
      }

      if (!isValid) {
        return;
      }

      options[name] = value;
    }
  }

  function ConflictManager(courses) {
    this._courseMap = _.reduce(courses, function (o, course) {
      o[course.id] = course;
      return o;
    }, {});

    this.checkConflict = _.memoize(this.checkConflict, function () {
      var courseIdA = arguments[0];
      var courseIdB = arguments[1];
      return (courseIdA < courseIdB) ?
          [courseIdA, courseIdB] : [courseIdB, courseIdA];
    });
  }

  ConflictManager.prototype.checkConflict = function checkConflict(courseIdA,
                                                                   courseIdB) {
    var courseA = this._courseMap[courseIdA];
    var courseB = this._courseMap[courseIdB];
    var conflicts = false;

    _(courseA.hours).forEach(function (hourA) {
      var conflictHour = _(courseB.hours).find(function (hourB) {
        /* jshint camelcase: false */
        return hourA.day_of_week === hourB.day_of_week &&
               hourA.start_time <= hourB.end_time &&
               hourA.end_time >= hourB.start_time;
      });

      if (conflictHour) {
        conflicts = true;
        return false;
      }
    });

    return conflicts;
  };
})();
