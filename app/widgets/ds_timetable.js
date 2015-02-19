(function () {
  /* jshint latedef: nofunc */
  'use strict';

  /**
   * @ngdoc directive
   * @name dashApp.widgets:dsTimetable
   * @description
   * # dsTimetable
   *
   * dsTimetable represents a timetable.
   */
  angular.module('dashApp.widgets')
    .directive('dsTimetable', dsTimetable);

  /* @ngInject */
  function dsTimetable() {
    /* jshint unused: false */

    var directive = {
      templateUrl: 'widgets/ds_timetable.tpl.html',
      restrict: 'E',
      scope: {
        timeRange: '=',
        fixedCourses: '=',
        previewCourse: '=',
        freeHours: '='
      },
      link: postLink
    };

    var startHour = 8;
    var minutePerTerm = 30;
    var minutePerBreak = 0;

    function postLink(scope, element, attrs) {
      var deregFns = [];
      var deregFn;
      scope.ui = {};

      var firstRun = true;
      var scheduledRuler = false;
      var scheduledFixed = false;
      var scheduledPreview = false;

      deregFn = scope.$watchCollection('timeRange', function () {
        scope.$evalAsync(function (scope) {
          if (firstRun) {
            scheduledRuler = true;
          } else {
            scheduledRuler = scheduledFixed = scheduledPreview = true;
          }
          checkAndDraw();
        });
      });
      deregFns.push(deregFn);

      deregFn = scope.$watchCollection('fixedCourses', function () {
        scope.$evalAsync(function (scope) {
          scheduledFixed = true;
          checkAndDraw();
        });
      });
      deregFns.push(deregFn);

      deregFn = scope.$watchCollection('freeHours', function () {
        scope.$evalAsync(function (scope) {
          scheduledFixed = true;
          checkAndDraw();
        });
      });
      deregFns.push(deregFn);

      deregFn = scope.$watchCollection('previewCourse', function () {
        scope.$evalAsync(function (scope) {
          scheduledPreview = true;
          checkAndDraw();
        });
      });
      deregFns.push(deregFn);

      function checkAndDraw() {
        if (firstRun) {
          if (!(scheduledRuler && scheduledFixed && scheduledPreview)) {
            return;
          }
          firstRun = false;
          scope.ui.hourHeight = getHourHeight(element);
        }

        if (scheduledRuler) {
          scheduledRuler = false;
          drawTimeRuler(scope, element);
        }
        if (scheduledFixed) {
          scheduledFixed = false;
          drawTableFixed(scope, element);
        }
        if (scheduledPreview) {
          scheduledPreview = false;
          drawTablePreview(scope, element);
        }
      }

      scope.$on('$destroy', function () {
        while (deregFns.length) {
          deregFns.shift()();
        }
      });
    }

    var markingTpl = angular.element('<span></span>').addClass('ruler-marking').text('12:34');

    function getHourHeight(element) {
      var hourHeight;

      var colRuler = element.find('.col-ruler');
      var marking1 = markingTpl.clone();
      var marking2 = markingTpl.clone();
      marking1.appendTo(colRuler);
      marking2.appendTo(colRuler);

      hourHeight = marking1.outerHeight(true);

      marking2.remove();
      marking1.detach();

      return hourHeight;
    }

    function drawTimeRuler(scope, element) {
      // calculate hour range and margins
      var timeRange = scope.timeRange;
      var startHour = timeToHour(timeRange[0]);
      var endHour = timeToHour(timeRange[1] + 1);
      var marginTopHour = Math.ceil(startHour) - startHour;
      var marginBottomHour = endHour - Math.floor(endHour);

      // prepare elements
      var colRuler = element.find('.col-ruler');
      var table = element.find('.table-ruler');
      var tableBody = table.find('tbody');

      // empty ruler
      colRuler.empty();
      tableBody.empty();

      var hourHeight = scope.ui.hourHeight;

      // draw markings
      var marking,
        markingText;
      for (var hour = Math.ceil(startHour); hour <= Math.floor(endHour); ++hour) {
        marking = markingTpl.clone();
        markingText = (hour % 12 || 12) + ':00';  // 12-hour notation
        marking.text(markingText);
        marking.appendTo(colRuler);
      }

      // add margins to ruler column
      var marginTop = hourHeight * marginTopHour;
      var marginBottom = hourHeight * marginBottomHour;
      var markings = colRuler.find('.ruler-marking');
      markings.first().css('margin-top', marginTop);
      markings.last().css('margin-bottom', marginBottom);

      // draw ruler table
      var tableRowTpl = angular.element('<tr><td colspan="6"></td></tr>');
      var tableRow;
      for (var halfHour = Math.ceil(startHour) * 2; halfHour <= Math.floor(endHour) * 2 - 1; ++halfHour) {
        tableRow = tableRowTpl.clone();
        if (halfHour % 2 === 0) {
          tableRow.addClass('row-o-clock');
        } else {
          tableRow.addClass('row-thirty');
        }
        tableBody.append(tableRow);
      }

      // add marginal rows to ruler table
      var tableRowHeight;

      if (marginTopHour > 0) {
        tableRowHeight = marginTop;
        tableRow = tableRowTpl.clone().addClass('row-thirty');
        tableBody.prepend(tableRow);
        if (marginTopHour * 2 > 1) {
          tableRow = tableRowTpl.clone().addClass('row-o-clock');
          tableBody.prepend(tableRow);
          tableRowHeight -= hourHeight / 2;
        }
        tableRow.css('height', tableRowHeight);
      }

      if (marginBottomHour > 0) {
        tableRowHeight = marginBottom;
        tableRow = tableRowTpl.clone().addClass('row-o-clock');
        tableBody.append(tableRow);
        if (marginBottomHour * 2 > 1) {
          tableRow = tableRowTpl.clone().addClass('row-thirty');
          tableBody.append(tableRow);
          tableRowHeight -= hourHeight / 2;
        }
        tableRow.css('height', tableRowHeight);
      }
    }

    function timeToHour(time) {
      return (time - 1) * ((minutePerTerm + minutePerBreak) / 60) + startHour;
    }

    function drawTableFixed(scope, element) {
      var table = element.find('.table-fixed');
      var tableBody = table.find('tbody');

      var hourHeight = scope.ui.hourHeight;

      var m = getDrawMatrix(scope.fixedCourses, scope.timeRange, scope.freeHours);

      drawTimetable(tableBody, hourHeight, m);
    }

    function drawTablePreview(scope, element) {
      var table = element.find('.table-preview');
      var tableBody = table.find('tbody');

      var hourHeight = scope.ui.hourHeight;

      var previewCourse = scope.previewCourse;
      var m = getDrawMatrix(previewCourse ? [previewCourse] : [], scope.timeRange);

      drawTimetable(tableBody, hourHeight, m);
    }

    var DRAW_MATRIX_ELEMENT_FREE_HOUR = -1;

    function drawTimetable(tableBody, hourHeight, matrix) {
      // empty table
      tableBody.empty();

      // iterate over matrix and create rows and cells
      for (var i = 0; i < matrix.length; ++i) {
        var row = angular.element('<tr></tr>');

        for (var j = 0; j < matrix[i].length; ++j) {
          var cell;
          var e = matrix[i][j];

          if (e === null) {
            // no course here: append an empty cell
            cell = angular.element('<td></td>');
          } else if (e === undefined) {
            // taken by a course started earlier: append nothing
          } else if (e === DRAW_MATRIX_ELEMENT_FREE_HOUR) {
            // free hour here: append a cell representing free hour
            cell = angular.element('<td class="free-hour"></td>');
          } else {
            // a course started here: append a cell representing the course
            var course = e[0];
            var duration = e[1];
            cell = createCourseCell(course, duration);
          }

          if (cell) {
            row.append(cell);
          }
        }

        row.height(hourHeight * (minutePerTerm / 60));
        tableBody.append(row);
      }
    }

    function getDrawMatrix(courses, timeRange, freeHours) {
      var m = [];

      // initialize matrix with null
      var startTime = timeRange[0];
      var endTime = timeRange[1];
      for (var i = startTime; i <= endTime; ++i) {
        var row = [];
        for (var j = 0; j < 6; ++j) {
          row.push(null);
        }
        m.push(row);
      }

      angular.forEach(courses, function (course) {
        angular.forEach(course.hours, function (hour) {
          /* jshint camelcase: false */
          var j = hour.day_of_week - 1;
          var startRowIndex = hour.start_time - startTime;
          var endRowIndex = hour.end_time - startTime;

          m[startRowIndex][j] = [course, hour.end_time - hour.start_time + 1];
          for (var i = startRowIndex + 1; i <= endRowIndex; ++i) {
            m[i][j] = undefined;
          }
        });
      });

      angular.forEach(freeHours, function (freeHour) {
        var dayOfWeek = freeHour[0];
        var time = freeHour[1];

        m[time - startTime][dayOfWeek - 1] = DRAW_MATRIX_ELEMENT_FREE_HOUR;
      });

      return m;
    }

    function createCourseCell(course, duration) {
      var cell = angular.element('<td class="course-hour"><span class="name"></span></td>');
      cell.attr('colspan', duration);
      cell.find('.name').text(course.subject.name);
      return cell;
    }

    return directive;
  }
})();
