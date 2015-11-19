'use strict';

(function (module, undefined) {
  function CreateResultBox(elem) {
    this.elem = elem;
    this.navTitle = elem.$('nav .title');
    this.btnBack = elem.$('nav > .btn-back');
    this.list = new TimetableList(elem);
    this.details = new TimetableDetails(elem);
  }

  Object.defineProperties(CreateResultBox.prototype, {
    'showingList': {
      get: function getShowingList() {
        return this.navTitle.getText().then(function (titleText) {
          return /Generated Timetables/.test(titleText);
        });
      }
    },
    'showingDetails': {
      get: function getShowingDetails() {
        return this.navTitle.getText().then(function (titleText) {
          return /Details/.test(titleText);
        });
      }
    }
  });

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

  function TimetableDetails(box) {
    this.statsElem = box.$('.stats');
    this.subjectElems = box.$$('.subjects > ds-subject');
  }

  Object.defineProperties(TimetableDetails.prototype, {
    'credits': {
      get: function () {
        return this.statsElem.$('.stat-credits > .number').getText();
      }
    },
    'nClassDays': {
      get: function () {
        return this.statsElem.$('.stat-n-class-days > .number').getText();
      }
    },
    'nFreeHours': {
      get: function () {
        return this.statsElem.$('.stat-n-free-hours > .number').getText();
      }
    },
    'nSubjects': {
      get: function () { return this.subjectElems.count(); }
    }
  });

})(module);
