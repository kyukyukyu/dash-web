'use strict';

(function (module, undefined) {
  function SearchResultBox(elem) {
    this.elem = elem;
    this.subjects = elem.$$('.subjects > ds-subject');
  }

  function Subject(elem) {
    this.elem = elem;
    this.courses = elem.$$('.courses > .course');
  }

  function Course(elem) {
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

  Object.defineProperties(SearchResultBox.prototype, {
    'numOfSubjects': {
      get: function () { return this.subjects.count(); }
    }
  });
  SearchResultBox.prototype.getSubjectAt = function (index) {
    return new Subject(this.subjects.get(index));
  };

  Object.defineProperties(Subject.prototype, {
    'numOfCourses': {
      get: function () { return this.courses.count(); }
    }
  });
  Subject.prototype.getCourseAt = function (index) {
    return new Course(this.courses.get(index));
  };
  'code name credit'.split(' ').forEach(defineFunc(Subject.prototype, '.cell '));

  'code instructor'.split(' ').forEach(defineFunc(Course.prototype));

  module.exports = SearchResultBox;
})(module);
