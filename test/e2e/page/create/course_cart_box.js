'use strict';

(function (module, undefined) {
  var CourseCart = require('../common/ds_course_cart');

  function CourseCartBox(elem) {
    this.elem = elem;
    this.courseCart = new CourseCart(elem.$('ds-course-cart'));
  }

  Object.defineProperties(CourseCartBox.prototype, {
    'numOfSubjects': {
      get: function () { return this.courseCart.numOfSubjects; }
    }
  });
  CourseCartBox.prototype.getSubjectAt = function (index) {
    return this.courseCart.getSubjectAt(index);
  };

  module.exports = CourseCartBox;
})(module);
