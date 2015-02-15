'use strict';

var HttpBackend = require('http-backend-proxy');
var mockCampuses = require('../../mock/campuses');
var mockDepartments = require('../../mock/departments');
var mockGenEduCategories = require('../../mock/gen_edu_categories');
var mockCourses = require('../../mock/courses');

var NavBar = require('../page/common/navbar');
var SearchOptionBox = require('../page/create/search_option_box');
var SearchResultBox = require('../page/create/search_result_box');

describe('Main', function () {

  var proxy;

  var navbar,
    keywordBox, gearIcon,
    searchOptionBox,
    searchResultBox,
    backdrop;

  beforeEach(function () {
    proxy = new HttpBackend(browser);
    mockCampuses(proxy.onLoad);
    mockDepartments(proxy.onLoad);
    mockGenEduCategories(proxy.onLoad);
    mockCourses(proxy.onLoad);
    browser.get('index_e2e.html');
  });

  beforeEach(function () {
    navbar = new NavBar();

    keywordBox = element(by.model('userInput.keyword'));
    gearIcon = $('.box-group-top button');

    searchOptionBox = new SearchOptionBox($('.box-group-bottom .box-search-option'));
    searchResultBox = new SearchResultBox($('.box-group-bottom .box-search-result'));

    backdrop = $('#dsBackdrop');
  });

  it('should automatically redirect to / when location hash is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch('/');
  });

  describe('searching', function () {
    describe('keyword box', function () {
      beforeEach(function () {
        expect(searchOptionBox.elem.isDisplayed()).toBeFalsy();
        expect(backdrop.isPresent()).toBeFalsy();
      });

      describe('when element is focused', function () {
        it('should open option box with backdrop when the keyword box is focused', function () {
          keywordBox.click();
        });

        it('should open option box with backdrop when the gear icon is clicked', function () {
          gearIcon.click();
        });

        afterEach(function () {
          expect(searchOptionBox.elem.isDisplayed()).toBeTruthy();
          expect(backdrop.isPresent()).toBeTruthy();
        });
      });

      it('should hide backdrop and boxes when backdrop is clicked', function () {
        keywordBox.click();
        backdrop.click();
        expect(backdrop.isPresent()).toBeFalsy();
        expect(searchOptionBox.elem.isDisplayed()).toBeFalsy();
      });

      describe('toggling option box', function () {
        it('should toggle option box with gear icon', function () {
          keywordBox.click();
          gearIcon.click();
          expect(searchOptionBox.elem.isDisplayed()).toBeFalsy();
          gearIcon.click();
          expect(searchOptionBox.elem.isDisplayed()).toBeTruthy();
        });

        it('should preserve status of option box even if keyword box is focused out', function () {
          keywordBox.click();
          gearIcon.click();
          expect(searchOptionBox.elem.isDisplayed()).toBeFalsy();
          backdrop.click();
          keywordBox.click();
          expect(searchOptionBox.elem.isDisplayed()).toBeFalsy();
        });
      });
    });

    describe('search options', function () {
      beforeEach(function () {
        gearIcon.click();
      });

      it('should show no other options than course type at first', function () {
        expect(searchOptionBox.btnGroupGrade.isDisplayed()).toBeFalsy();
      });

      it('should show options related to major courses when type option is set to major', function () {
        var selectBoxDepartment = searchOptionBox.selectBoxDepartment;
        searchOptionBox.setType(searchOptionBox.TYPE_MAJOR);
        expect(searchOptionBox.btnGroupGrade.isDisplayed()).toBeTruthy();
        expect(selectBoxDepartment.isDisplayed()).toBeTruthy();
        expect(selectBoxDepartment.$('option:checked').getText()).toEqual('(All)');
        expect(selectBoxDepartment.$$('option').count()).toBe(1 + 11);
        expect(searchOptionBox.selectBoxCategory.isDisplayed()).toBeFalsy();
      });

      it('should show options related to general courses when type option is set to general', function () {
        var selectBoxCategory = searchOptionBox.selectBoxCategory;
        searchOptionBox.setType(searchOptionBox.TYPE_GENERAL);
        expect(selectBoxCategory.isDisplayed()).toBeTruthy();
        expect(selectBoxCategory.$('option:checked').getText()).toEqual('(All)');
        expect(selectBoxCategory.$$('option').count()).toBe(1 + 4);
        expect(searchOptionBox.btnGroupGrade.isDisplayed()).toBeFalsy();
        expect(searchOptionBox.selectBoxDepartment.isDisplayed()).toBeFalsy();
      });
    });

    it('should show result box only after retrieving search results', function () {
      keywordBox.click();
      expect(searchResultBox.elem.isDisplayed()).toBeFalsy();
      keywordBox.sendKeys('software engineering', protractor.Key.ENTER);
      expect(searchResultBox.elem.isDisplayed()).toBeTruthy();
    });

    describe('result box', function () {

      beforeEach(function () {
        keywordBox.click();
        keywordBox.sendKeys('software engineering', protractor.Key.ENTER);
      });

      it('should show search results', function () {
        var subject, course;
        expect(searchResultBox.numOfSubjects).toBe(4);

        subject = searchResultBox.getSubjectAt(0);
        expect(subject.code).toEqual('CSE4006');
        expect(subject.name).toEqual('Software Engineering');
        expect(subject.credit).toEqual('3.00');
        expect(subject.numOfCourses).toBe(2);
        course = subject.getCourseAt(0);
        expect(course.code).toEqual('10029');
        expect(course.instructor).toEqual('Minsoo Ryu');
        course = subject.getCourseAt(1);
        expect(course.code).toEqual('10030');
        expect(course.instructor).toEqual('IN RYU');
      });
    });
  });

  afterEach(function () {
    proxy.onLoad.reset();
  });

});
