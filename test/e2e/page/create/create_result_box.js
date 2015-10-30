'use strict';

(function (module, undefined) {
  function CreateResultBox(elem) {
    // TODO: add property 'list' and 'details' for each UI state.
    this.elem = elem;
    this.list = new TimetableList(elem);
  }

  Object.defineProperties(CreateResultBox.prototype, {
    'showingList': {
      value: true
    },
    'showingDetails': {
      value: false
    }
  });
  CreateResultBox.prototype.clickGenerateButton = function () {
    return this.elem.$('.btn-generate').click();
  };

  module.exports = CreateResultBox;

  function TimetableList(box) {
    this.ttElems = box.$$('.item-timetable');
  }

  Object.defineProperties(TimetableList.prototype, {
    'nTimetables': {
      get: function () { return this.ttElems.count(); }
    }
  });
  TimetableList.prototype.getItemAt = function (index) {
    return new TimetableListItem(this.ttElems.get(index));
  };

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
