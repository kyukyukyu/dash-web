'use strict';

var HttpBackend = require('http-backend-proxy');
var mockCampuses = require('../../mock/campuses');
var mockDepartments = require('../../mock/departments');
var mockGenEduCategories = require('../../mock/gen_edu_categories');

describe('Main', function () {

  var proxy;

  var navbar,
    keywordBox, gearIcon,
    boxGroupBottom, btnGroupType, btnGroupGrade, selectBoxDepartment, selectBoxCategory,
    backdrop;

  beforeEach(function () {
    proxy = new HttpBackend(browser);
    mockCampuses(proxy.onLoad);
    mockDepartments(proxy.onLoad);
    mockGenEduCategories(proxy.onLoad);
    browser.get('index_e2e.html');
  });

  beforeEach(function () {
    navbar = $('nav');

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

      it('should show options related to major courses when type option is set to major', function () {
        btnGroupType.$('[btn-radio="\'major\'"]').click();
        expect(btnGroupGrade.isDisplayed()).toBeTruthy();
        expect(selectBoxDepartment.isDisplayed()).toBeTruthy();
        expect(selectBoxDepartment.$('option:checked').getText()).toEqual('(All)');
        expect(selectBoxDepartment.$$('option').count()).toBe(1 + 11);
        expect(selectBoxCategory.isDisplayed()).toBeFalsy();
      });

      it('should show options related to general courses when type option is set to general', function () {
        btnGroupType.$('[btn-radio="\'general\'"]').click();
        expect(selectBoxCategory.isDisplayed()).toBeTruthy();
        expect(selectBoxCategory.$('option:checked').getText()).toEqual('(All)');
        expect(selectBoxCategory.$$('option').count()).toBe(1 + 4);
        expect(btnGroupGrade.isDisplayed()).toBeFalsy();
        expect(selectBoxDepartment.isDisplayed()).toBeFalsy();
      });
    });
  });

  afterEach(function () {
    proxy.onLoad.reset();
  });

});
