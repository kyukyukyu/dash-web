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
        fixedCourses: '='
      },
      link: postLink
    };

    function postLink(scope, element, attrs) {
      scope.$watchCollection('timeRange', function (timeRange) {
        var startTime = timeRange[0],
          endTime = timeRange[1];

        scope.$evalAsync(function (scope) {
          drawTimeRuler(element, startTime, endTime);
        });
      });

      scope.$watchCollection('fixedCourses', function (fixedCourses) {
        scope.$evalAsync(function (scope) {
          drawFixedCourses(element, fixedCourses, scope.timeRange);
        });
      });
    }

    function drawTimeRuler(element, startTime, endTime) {
      // calculate hour range and margins
      var startHour = timeToHour(startTime);
      var endHour = timeToHour(endTime + 1);
      var marginTopHour = Math.ceil(startHour) - startHour;
      var marginBottomHour = endHour - Math.floor(endHour);

      // prepare elements
      var colRuler = element.find('.col-ruler');
      var table = element.find('.table-ruler');
      var tableBody = table.find('tbody');

      // empty ruler
      colRuler.empty();
      tableBody.empty();

      // calculate the height of unit marking
      var markingTpl = angular.element('<span></span>').addClass('ruler-marking').text('12:34');
      var markingTplClone = markingTpl.clone();
      markingTpl.appendTo(colRuler);
      markingTplClone.appendTo(colRuler);
      var hourHeight = markingTpl.outerHeight(true);
      markingTplClone.remove();
      markingTpl.detach();

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
      var startHour = 8;
      var minutePerTime = 30;
      var minutePerBreak = 0;
      return (time - 1) * ((minutePerTime + minutePerBreak) / 60) + startHour;
    }

    function drawFixedCourses(element, fixedCourses, timeRange) {
      var m = getDrawMatrix(fixedCourses, timeRange);

      var table = element.find('.table-fixed');
      var tableBody = table.find('tbody');

      // empty table
      tableBody.empty();

      // iterate over matrix and create rows and cells
      for (var i = 0; i < m.length; ++i) {
        var row = angular.element('<tr></tr>');

        for (var j = 0; j < m[i].length; ++j) {
          var cell;

          if (m[i][j] === null) {
            // no course here: append an empty cell
            cell = angular.element('<td></td>');
          } else if (m[i][j] === undefined) {
            // taken by a course started earlier: append nothing
          } else {
            // a course started here: append a cell representing the course
            var e = m[i][j];
            var course = e[0];
            var duration = e[1];
            cell = createCourseCell(course, duration);
          }

          if (cell) {
            row.append(cell);
          }
        }

        tableBody.append(row);
      }
    }

    function getDrawMatrix(courses, timeRange) {
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

      return m;
    }

    function createCourseCell(course, duration) {
      var cell = angular.element('<td><span class="name"></span></td>');
      cell.attr('colspan', duration);
      cell.find('.name').text(course.subject.name);
      return cell;
    }

    return directive;
  }
})();