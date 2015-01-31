'use strict';

function SearchOptionBox(elem) {
  this.elem = elem;
  this.btnGroupType =
    elem.$('[aria-labelledby=dsCatalogSearchBoxLabelType]');
  this.btnGroupGrade =
    elem.$('[aria-labelledby=dsCatalogSearchBoxLabelGrade]');
  this.selectBoxDepartment =
    elem.$('[aria-labelledby=dsCatalogSearchBoxLabelDept]');
  this.selectBoxCategory =
    elem.$('[aria-labelledby=dsCatalogSearchBoxLabelCat]');
}

SearchOptionBox.prototype.TYPE_ALL = 0;
SearchOptionBox.prototype.TYPE_MAJOR = 1;
SearchOptionBox.prototype.TYPE_GENERAL = 2;
SearchOptionBox.prototype.setType = function (type) {
  var btnIndex;
  switch (type) {
    case this.TYPE_ALL:
          btnIndex = 0;
          break;
    case this.TYPE_MAJOR:
          btnIndex = 1;
          break;
    case this.TYPE_GENERAL:
          btnIndex = 2;
          break;
    default:
          throw new Error('invalid type: ' + type);
  }
  return this.btnGroupType.$$('button').get(btnIndex).click();
};

SearchOptionBox.prototype.GRADE_ALL = 0;
SearchOptionBox.prototype.setGrade = function (grade) {
  var btnIndex;
  if (grade === this.GRADE_ALL) {
    btnIndex = 0;
  } else {
    btnIndex = grade;
  }
  return this.btnGroupGrade.$$('button').get(btnIndex).click();
};

module.exports = SearchOptionBox;
