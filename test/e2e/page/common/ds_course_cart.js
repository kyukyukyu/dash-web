'use strict';

(function (module, undefined) {
  function CourseCart(elem) {
    this.elem = elem;
    this.subjectElems = this.elem.$$('ds-subject');
  }

  var Subject = require('./ds_subject');

  Object.defineProperties(CourseCart.prototype, {
    'numOfSubjects': {
      get: function () { return this.subjectElems.count(); }
    }
  });
  CourseCart.prototype.getSubjectAt = function (index) {
    return new Subject(this.subjectElems.get(index));
  };

  module.exports = CourseCart;
})(module);
