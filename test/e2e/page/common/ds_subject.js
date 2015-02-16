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
    this.actions = this.elem.$('.actions');
    this.btnCart = this.actions.$('.btn-cart');
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
    },

    'verticalBarBgColor': {
      get: function () { return this.verticalBar.getCssValue('background-color'); }
    }
  });
  Subject.prototype.VERTICAL_BAR_COLOR = {
    REQUIRED: 'rgba(82, 155, 192, 1)',
    OPTIONAL: 'rgba(122, 173, 76, 1)',
    UNAVAILABLE: 'rgba(154, 153, 148, 1)'
  };
  Subject.prototype.getCourseAt = function (index) {
    return new Course(this.courses.get(index));
  };
  Subject.prototype.clickCartButton = function () {
    browser.actions().mouseMove(this.actions).perform();
    this.btnCart.click();
  };
  Subject.prototype.clickVerticalBar = function (mouseout) {
    this.verticalBar.click();
    if (mouseout === undefined || mouseout) {
      browser.actions().mouseMove(this.actions).perform();
    }
  };
  'code name credit'.split(' ').forEach(defineFunc(Subject.prototype, '.cell '));

  Course.prototype.clickCartButton = function () {
    browser.actions().mouseMove(this.actions).perform();
    this.btnCart.click();
  };
  'code instructor'.split(' ').forEach(defineFunc(Course.prototype));

  module.exports = Subject;
})(module);
