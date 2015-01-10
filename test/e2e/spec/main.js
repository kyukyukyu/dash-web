'use strict';

describe('Dash App', function () {

  var keywordBox, gearIcon,
      boxGroupBottom, btnGroupType, btnGroupGrade, selectBoxDepartment, selectBoxCategory,
      backdrop;

  beforeEach(function () {
    browser.get('index_e2e.html');
  });

  beforeEach(function () {
    keywordBox = element(by.model('userInput.keyword'));
    gearIcon = $('.box-group-top button');

    boxGroupBottom = $('.box-group-bottom > .box-group');
    btnGroupType = boxGroupBottom.$('[aria-labelledby=dsCatalogSearchBoxLabelType]');
    btnGroupGrade = boxGroupBottom.$('[aria-labelledby=dsCatalogSearchBoxLabelGrade]');
    selectBoxDepartment = boxGroupBottom.$('[aria-labelledby=dsCatalogSearchBoxLabelDept]');
    selectBoxCategory = boxGroupBottom.$('[aria-labelledby=dsCatalogSearchBoxLabelCat]');

    backdrop = $('#dsBackdrop');
  });

  it('should automatically redirect to / when location hash is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch('/');
  });

  describe('searching', function () {
    beforeEach(function () {
      expect(boxGroupBottom.isDisplayed()).toBeFalsy();
      expect(backdrop.isPresent()).toBeFalsy();
    });

    describe('should open the box group of search option box and search result box with backdrop', function () {
      it('when the keyword box is focused', function () {
        keywordBox.click();
      });

      it('when the gear icon is clicked', function () {
        gearIcon.click();
      });

      afterEach(function () {
        expect(boxGroupBottom.isDisplayed()).toBeTruthy();
        expect(backdrop.isPresent()).toBeTruthy();
      });
    });

    it('should hide backdrop and the box group when backdrop is clicked', function () {
      keywordBox.click();
      backdrop.click();
      expect(backdrop.isPresent()).toBeFalsy();
      expect(boxGroupBottom.isDisplayed()).toBeFalsy();
    });

    describe('search options', function () {
      beforeEach(function () {
        gearIcon.click();
      });

      it('should show no other options than course type at first', function () {
        expect(btnGroupGrade.isDisplayed()).toBeFalsy();
      });

      it('should show options related to major courses when type option is set to general', function () {
        btnGroupType.$('[btn-radio="\'major\'"]').click();
        expect(btnGroupGrade.isDisplayed()).toBeTruthy();
        expect(selectBoxDepartment.isDisplayed()).toBeTruthy();
        expect(selectBoxCategory.isDisplayed()).toBeFalsy();
      });

      it('should show options related to general courses when type option is set to general', function () {
        btnGroupType.$('[btn-radio="\'general\'"]').click();
        expect(selectBoxCategory.isDisplayed()).toBeTruthy();
        expect(btnGroupGrade.isDisplayed()).toBeFalsy();
        expect(selectBoxDepartment.isDisplayed()).toBeFalsy();
      });
    });
  });

});
