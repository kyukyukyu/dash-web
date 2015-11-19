(function (module, undefined) {
  'use strict';

  function Timetable(elem) {
    this.elem = elem;
    this.rulerMarkings = this.elem.$$('.ruler-marking');
    this.tableRuler = this.elem.$('.table-ruler');
    this.tableFixed = this.elem.$('.table-fixed');
    this.tablePreview = this.elem.$('.table-preview');
  }

  function CourseHour(elem) {
    this.elem = elem;
  }

  var defineFunc = function (prototype, prefixSelector) {
    return function (prop) {
      Object.defineProperty(prototype, prop, {
        get: function () {
          return this.elem.$((prefixSelector || '') + '.' + prop).getText();
        }
      });
    };
  };

  Object.defineProperties(Timetable.prototype, {
    'numOfPreviewHours': {
      get: function () { return this.tablePreview.$$('tbody > tr > td[colspan]').count(); }
    }
  });
  Timetable.prototype.getPreviewHourAt = function (rowIndex, columnIndex, spannedColumns) {
    var row = this.tablePreview.$$('tbody > tr').get(rowIndex);
    var cell = row.$$('td').get(columnIndex - (spannedColumns || 0));
    return new CourseHour(cell);
  };
  Timetable.prototype.getFixedHourAt = function (rowIndex, columnIndex, spannedColumns) {
    var row = this.tableFixed.$$('tbody > tr').get(rowIndex);
    var cell = row.$$('td').get(columnIndex - (spannedColumns || 0));
    return new CourseHour(cell);
  };

  Object.defineProperties(CourseHour.prototype, {
    'duration': {
      get: function () {
        return this.elem.getAttribute('colspan').then(function (val) {
          return parseInt(val, 10);
        });
      }
    }
  });
  'name'.split(' ').forEach(defineFunc(CourseHour.prototype));

  module.exports = Timetable;
})(module);
