'use strict';

(function (module, undefined) {
  function CreateResultBox(elem) {
    this.elem = elem;
    this.ttElems = this.elem.$$('.item-timetable');
  }

  Object.defineProperties(CreateResultBox.prototype, {
    'nTimetables': {
      get: function () { return this.ttElems.count(); }
    }
  });
  CreateResultBox.prototype.getItemAt = function (index) {
    return new TimetableListItem(this.ttElems.get(index));
  };
  CreateResultBox.prototype.clickGenerateButton = function () {
    return this.elem.$('.btn-generate').click();
  };

  module.exports = CreateResultBox;

  function TimetableListItem(elem) {
    this.elem = elem;
  }

  Object.defineProperties(TimetableListItem.prototype, {
    'credits': {
      get: function () { return this.elem.$('.credits').getText(); }
    },
    'nClassDays': {
      get: function () { return this.elem.$('.n-class-days').getText(); }
    },
    'nFreeHours': {
      get: function () { return this.elem.$('.n-free-hours').getText(); }
    }
  });

})(module);
