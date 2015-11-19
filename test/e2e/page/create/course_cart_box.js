'use strict';

(function (module, undefined) {
  var CourseCart = require('../widgets/ds_course_cart');

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
  CourseCartBox.prototype.clickGenerateButton = function () {
    return this.elem.$('.btn-generate').click();
  };

  module.exports = CourseCartBox;
})(module);
