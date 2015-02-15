'use strict';

(function (module, undefined) {
  function Subject(elem) {
    this.elem = elem;
    this.verticalBar = this.elem.$('.is-required');
    this.actions = this.elem.$('.cell > .actions');
    this.chevron = this.actions.$('.chevron');
    this.btnCart = this.actions.$('.btn-cart');
    this.coursesElem = this.elem.$('.courses');
    this.courses = this.elem.$$('.courses > .course');
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

  module.exports = Subject;
})(module);
