'use strict';

(function (module, undefined) {
  function SearchResultBox(elem) {
    this.elem = elem;
    this.subjects = elem.$$('.subjects > ds-subject');
  }

  var Subject = require('../widgets/ds_subject');

  Object.defineProperties(SearchResultBox.prototype, {
    'numOfSubjects': {
      get: function () { return this.subjects.count(); }
    }
  });
  SearchResultBox.prototype.getSubjectAt = function (index) {
    return new Subject(this.subjects.get(index));
  };

  module.exports = SearchResultBox;
})(module);
